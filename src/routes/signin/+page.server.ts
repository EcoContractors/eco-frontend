import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';
import type { LoginResponse } from '$lib/types';

export const load: PageServerLoad = async ({ url, locals }) => {
	// If already authenticated, redirect to dashboard
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {
		verified: url.searchParams.get('verified') === 'true',
		reset: url.searchParams.get('reset') === 'true',
		redirectTo: url.searchParams.get('redirectTo') || '/dashboard'
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const redirectTo = url.searchParams.get('redirectTo') || '/dashboard';

		if (!email || !password) {
			return fail(400, {
				email,
				message: 'Email and password are required'
			});
		}

		try {
			const result = await serverApi.post<LoginResponse>('/auth/login', { email, password });

			// Set HTTP-only cookies
			cookies.set('accessToken', result.token, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 55 // 55 minutes
			});

			cookies.set('refreshToken', result.refreshToken, {
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7 // 7 days
			});

			// Redirect to the intended page or dashboard
			throw redirect(303, redirectTo);
		} catch (error) {
			if (error instanceof ServerApiError) {
				return fail(error.status, {
					email,
					message: error.message
				});
			}

			// Re-throw redirect errors
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				throw error;
			}

			console.error('Login error:', error);
			return fail(500, {
				email,
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
