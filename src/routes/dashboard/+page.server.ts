import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

const API_BASE_URL = env.API_BASE_URL ?? 'http://localhost:5000';

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
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

	// Fetch dashboard stats and clients for approved agents
	let stats = null;
	let clients = null;
	let error = null;

	if (user.role === 'agent' && user.agentStatus === 'approved') {
		const accessToken = locals.accessToken || cookies.get('accessToken');

		console.log('🔑 Access Token:', accessToken ? 'Present' : 'Missing');

		if (accessToken) {
			try {
				// Fetch dashboard stats
				const statsResponse = await fetch(`${API_BASE_URL}/api/v1/agents/dashboard`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					}
				});

				console.log('📊 Stats Response Status:', statsResponse.status);

				if (statsResponse.ok) {
					const data = await statsResponse.json();
					stats = data.stats || null;
					console.log('✅ Stats loaded successfully');
				} else if (statsResponse.status === 401) {
					error = 'Session expired. Please log in again.';
				} else if (statsResponse.status === 403) {
					error = 'Access denied. You may not have permission to view this dashboard.';
				} else {
					try {
						const errorData = await statsResponse.json();
						error = errorData.message || 'Failed to load dashboard statistics';
					} catch (e) {
						error = 'Failed to load dashboard statistics';
					}
				}

				// Fetch clients list
				console.log('🔄 Fetching clients from:', `${API_BASE_URL}/api/v1/agents/clients`);
				
				const clientsResponse = await fetch(`${API_BASE_URL}/api/v1/agents/clients`, {
					method: 'GET',
					headers: {
						'Authorization': `Bearer ${accessToken}`,
						'Content-Type': 'application/json'
					}
				});

				console.log('👥 Clients Response Status:', clientsResponse.status);

				if (clientsResponse.ok) {
					const data = await clientsResponse.json();
					console.log('📦 Clients data received:', JSON.stringify(data));
					clients = {
						total: data.total || 0,
						requests: data.requests || []
					};
					console.log('✅ Clients processed:', clients);
				} else {
					console.log('❌ Clients fetch failed:', clientsResponse.status, clientsResponse.statusText);
					const errorText = await clientsResponse.text();
					console.log('Error response:', errorText);
				}

			} catch (err) {
				console.error('❌ Error fetching agent data:', err);
				error = 'Failed to connect to the server. Please try again later.';
			}
		} else {
			error = 'Authentication token not found';
		}
	}

	console.log('🎯 Final return data - clients:', clients);

	return {
		stats,
		clients,
		error
	};
};