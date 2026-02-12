import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { serverApi, ServerApiError } from '$lib/server/api';
import type { RegisterResponse } from '$lib/types';

interface AgentValidationResponse {
	valid: boolean;
	agent?: {
		fullName: string;
		referralCode: string;
	};
	message?: string;
}

export const load: PageServerLoad = async ({ params, locals }) => {
	// If already authenticated, redirect to dashboard
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	const { ref } = params;

	try {
		// Validate the referral code
		const result = await serverApi.get<AgentValidationResponse>(`/agents/validate/${ref}`);

		if (!result.valid) {
			return {
				valid: false,
				error: result.message || 'Invalid referral code',
				referralCode: ref
			};
		}

		return {
			valid: true,
			agentName: result.agent?.fullName,
			referralCode: ref
		};
	} catch (error) {
		if (error instanceof ServerApiError) {
			return {
				valid: false,
				error: error.message,
				referralCode: ref
			};
		}

		console.error('Referral validation error:', error);
		return {
			valid: false,
			error: 'Unable to validate referral code. Please try again.',
			referralCode: ref
		};
	}
};

export const actions: Actions = {
	default: async ({ request, params }) => {
		const data = await request.formData();
		const firstName = data.get('firstName') as string;
		const lastName = data.get('lastName') as string;
		const email = data.get('email') as string;
		const password = data.get('password') as string;
		const confirmPassword = data.get('confirmPassword') as string;
		const phone = (data.get('phone') as string) || '';
		const referralCode = params.ref;

		// Basic server-side validation
		if (!firstName || !lastName || !email || !password || !confirmPassword) {
			return fail(400, {
				firstName,
				lastName,
				email,
				message: 'All fields are required'
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				firstName,
				lastName,
				email,
				message: 'Passwords do not match'
			});
		}

		if (password.length < 8) {
			return fail(400, {
				firstName,
				lastName,
				email,
				message: 'Password must be at least 8 characters'
			});
		}

		try {
			await serverApi.post<RegisterResponse>('/auth/register', {
				firstName,
				lastName,
				email,
				password,
				phone,
				role: 'customer',
				referralCode
			});

			// Redirect to eco leasing with ref so client can book; ref keeps agent attribution for bookings
			throw redirect(303, `/ecoLeasing?ref=${encodeURIComponent(referralCode)}`);
		} catch (error) {
			if (error instanceof ServerApiError) {
				return fail(error.status, {
					firstName,
					lastName,
					email,
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
				message: 'An unexpected error occurred. Please try again.'
			});
		}
	}
};
