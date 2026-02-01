import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';

export const load: PageServerLoad = async ({ url, locals }) => {
	// If already authenticated, redirect to dashboard
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	const token = url.searchParams.get('token');

	if (!token) {
		throw redirect(303, '/forgot-password');
	}

	return {
		token
	};
};

export const actions: Actions = {
	default: async ({ request, url }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;
		const token = url.searchParams.get('token');

		if (!token) {
			return fail(400, {
				message: 'Reset token is missing. Please request a new password reset.'
			});
		}

		if (!password || !confirmPassword) {
			return fail(400, {
				message: 'Both password fields are required'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				message: 'Passwords do not match'
			});
		}

		if (password.length < 8) {
			return fail(400, {
				message: 'Password must be at least 8 characters'
			});
		}

		// Validate password strength
		const hasUppercase = /[A-Z]/.test(password);
		const hasLowercase = /[a-z]/.test(password);
		const hasDigit = /\d/.test(password);
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

		if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecial) {
			return fail(400, {
				message: 'Password must include uppercase, lowercase, number, and special character'
			});
		}

		try {
			await serverApi.post('/auth/reset-password', {
				token,
				password
			});

			// Redirect to signin with success message
			throw redirect(303, '/signin?reset=true');
		} catch (error) {
			if (error instanceof ServerApiError) {
				// Check for expired/invalid token
				if (error.status === 400 || error.status === 404) {
					return fail(error.status, {
						message: error.message,
						tokenInvalid: true
					});
				}
				return fail(error.status, {
					message: error.message
				});
			}

			// Re-throw redirect errors
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				throw error;
			}

			console.error('Reset password error:', error);
			return fail(500, {
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
