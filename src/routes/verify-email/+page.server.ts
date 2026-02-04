import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// The backend email sends users to /verify-email?token=...
// Redirect to /verify?token=... where the actual verification logic lives.
export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const email = url.searchParams.get('email');

	const params = new URLSearchParams();
	if (token) params.set('token', token);
	if (email) params.set('email', email);

	throw redirect(307, `/verify?${params.toString()}`);
};
