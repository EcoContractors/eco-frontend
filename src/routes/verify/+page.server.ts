import { redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';
import type { ApiResponse } from '$lib/types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const email = url.searchParams.get('email');
	const registered = url.searchParams.get('registered') === 'true';

	// If there's a verification token, process it
	if (token) {
		try {
			const result = await serverApi.post<ApiResponse & { user?: { role?: string } }>('/auth/verify-email', { token });
			// Redirect customers to eco leasing page, agents to dashboard
			const redirectTo = result.user?.role === 'agent' ? '/dashboard' : '/ecoLeasing';
			redirect(303, `/signin?verified=true&redirectTo=${encodeURIComponent(redirectTo)}`);
		} catch (error) {
			// Re-throw SvelteKit redirects
			if (isRedirect(error)) {
				throw error;
			}

			const message =
				error instanceof ServerApiError
					? error.message
					: 'Email verification failed. The link might be invalid or expired.';

			return {
				success: false,
				message,
				email
			};
		}
	}

	// No token - show the "check your email" message
	return {
		success: registered,
		message: registered
			? 'Registration successful! Please check your email to verify your account.'
			: 'Please check your email for a verification link.',
		email,
		needsVerification: true
	};
};

export const actions: Actions = {
	resend: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return {
				success: false,
				message: 'Email is required to resend verification.'
			};
		}

		try {
			await serverApi.post<ApiResponse>('/auth/resend-verification', { email });
			return {
				success: true,
				message: 'Verification email sent! Please check your inbox.',
				email
			};
		} catch (error) {
			const message =
				error instanceof ServerApiError
					? error.message
					: 'Failed to resend verification email. Please try again.';

			return {
				success: false,
				message,
				email
			};
		}
	}
};
