import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';
import type { RegisterResponse } from '$lib/types';

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
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;
		const phone = (data.get('phone') as string) || '';

		// Normalize optional referral code: only keep non-empty strings
		const rawReferralCode = data.get('referralCode');
		const referralCode =
			typeof rawReferralCode === 'string' && rawReferralCode.trim() !== ''
				? rawReferralCode.trim()
				: undefined;

		// Basic server-side validation
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				firstName,
				lastName,
				email,
				referralCode,
				message: 'All fields are required'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				firstName,
				lastName,
				email,
				referralCode,
				message: 'Passwords do not match'
			});
		}

		if (password.length < 8) {
			return fail(400, {
				firstName,
				lastName,
				email,
				referralCode,
				message: 'Password must be at least 8 characters'
			});
		}

		try {
			const payload: Record<string, unknown> = {
				firstName,
				lastName,
				email,
				password,
				phone,
				role: 'agent'
			};

			if (referralCode) {
				payload.referralCode = referralCode;
			}

			await serverApi.post<RegisterResponse>('/auth/register', payload);

			// Redirect to verify page with email for context
			throw redirect(303, `/verify?email=${encodeURIComponent(email)}&registered=true`);
		} catch (error) {
			if (error instanceof ServerApiError) {
				return fail(error.status, {
					firstName,
					lastName,
					email,
					referralCode,
					message: error.message
				});
			}

			// Re-throw redirect errors
			if (error && typeof error === 'object' && 'status' in error && error.status === 303) {
				throw error;
			}

			console.error('Registration error:', error);
			return fail(500, {
				firstName,
				lastName,
				email,
				referralCode,
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
