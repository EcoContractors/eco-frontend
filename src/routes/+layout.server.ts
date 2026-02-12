import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	return {
		user: locals.user,
		isAuthenticated: !!locals.user,
		pathname: url.pathname
	};
};
