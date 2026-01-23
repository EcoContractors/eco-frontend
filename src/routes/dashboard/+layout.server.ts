import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	// Server-side authentication check
	if (!locals.user) {
		throw redirect(303, `/signin?redirectTo=${encodeURIComponent(url.pathname)}`);
	}

	return {
		user: locals.user
	};
};
