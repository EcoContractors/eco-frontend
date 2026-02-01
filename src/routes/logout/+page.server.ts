import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect GET requests to home
	throw redirect(303, '/');
};

export const actions: Actions = {
	default: async ({ cookies }) => {
		// Clear auth cookies
		cookies.delete('accessToken', { path: '/' });
		cookies.delete('refreshToken', { path: '/' });

		// Redirect to home
		throw redirect(303, '/');
	}
};
