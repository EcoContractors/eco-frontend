import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const user = locals.user;

	// If not authenticated, send to signin and then back here
	if (!user) {
		const redirectTo = `${url.pathname}${url.search}` || '/dashboard';
		throw redirect(303, `/signin?redirectTo=${encodeURIComponent(redirectTo)}`);
	}

	// If user is an agent but not yet approved, prevent access to the agent dashboard
	if (user.role === 'agent' && user.agentStatus && user.agentStatus !== 'approved') {
		// Redirect home (or another info page) with agentStatus query for potential UI messaging
		throw redirect(303, `/?agentStatus=${encodeURIComponent(user.agentStatus)}`);
	}

	// Nothing extra to load; layout already provides user/isAuthenticated
	return {};
}
