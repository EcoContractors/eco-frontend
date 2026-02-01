import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';

export const load: PageServerLoad = async ({ locals }) => {
	// If already authenticated, redirect to dashboard
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;

		if (!email) {
			return fail(400, {
				email,
				message: 'Email is required'
			});
		}

		try {
			await serverApi.post('/auth/forgot-password', { email });

			// Always show success message (don't reveal if email exists)
			return {
				success: true,
				email
			};
		} catch (error) {
			// Even on error, show success message to not reveal if email exists
			// Only log the actual error server-side
			if (error instanceof ServerApiError) {
				console.error('Forgot password error:', error.message);
			} else {
				console.error('Forgot password error:', error);
			}

			// Return success to not reveal if email exists
			return {
				success: true,
				email
			};
		}
	}
};
