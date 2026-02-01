import type { Handle } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';

async function loadAgentStatus(token: string): Promise<string | undefined> {
	try {
		const response = await fetch(`${API_BASE_URL}/api/v1/agents/profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) return undefined;

		const data = await response.json().catch(() => null as unknown);
		const status = (data as any)?.agent?.status;
		return typeof status === 'string' ? status : undefined;
	} catch (error) {
		console.error('Error loading agent status in hooks.server:', error);
		return undefined;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	const accessToken = event.cookies.get('accessToken');
	const refreshToken = event.cookies.get('refreshToken');

	// Initialize locals
	event.locals.user = null;
	event.locals.accessToken = null;

	if (accessToken) {
		try {
			// Decode JWT to get user info (without verification - backend handles that)
			const payload = JSON.parse(atob(accessToken.split('.')[1]));

			// Check if token is expired
			const isExpired = payload.exp * 1000 < Date.now();

			if (isExpired && refreshToken) {
				// Try to refresh the token
				const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh-token`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refreshToken })
				});

				if (refreshResponse.ok) {
					const data = await refreshResponse.json();
					const newAccessToken = data.accessToken || data.token;

					if (newAccessToken) {
						// Set new access token cookie
						event.cookies.set('accessToken', newAccessToken, {
							path: '/',
							httpOnly: true,
							secure: process.env.NODE_ENV === 'production',
							sameSite: 'lax',
							maxAge: 60 * 55 // 55 minutes
						});

						// Decode new token for user info
						const newPayload = JSON.parse(atob(newAccessToken.split('.')[1]));
						event.locals.user = {
							id: newPayload.userId,
							email: newPayload.email,
							role: newPayload.role,
							firstName: newPayload.firstName || '',
							lastName: newPayload.lastName || '',
							isActive: true,
							isVerified: true,
							agentStatus: undefined // Initialize agentStatus
						};

						// If user is an agent, fetch their current agent status from the backend
						if (event.locals.user.role === 'agent') {
							const status = await loadAgentStatus(newAccessToken);
							if (status) {
								event.locals.user.agentStatus = status as any;
							}
						}

						event.locals.accessToken = newAccessToken;
					}
				} else {
					// Refresh failed, clear cookies
					event.cookies.delete('accessToken', { path: '/' });
					event.cookies.delete('refreshToken', { path: '/' });
				}
			} else if (!isExpired) {
				// Token is valid
					event.locals.user = {
					id: payload.userId,
					email: payload.email,
					role: payload.role,
					firstName: payload.firstName || '',
					lastName: payload.lastName || '',
					isActive: true,
					isVerified: true,
					agentStatus: undefined // Initialize agentStatus
				};

				if (event.locals.user.role === 'agent') {
					const status = await loadAgentStatus(accessToken);
					if (status) {
						event.locals.user.agentStatus = status as any;
					}
				}

				event.locals.accessToken = accessToken;
			}
		} catch (error) {
			console.error('Error processing auth token:', error);
			// Clear invalid cookies
			event.cookies.delete('accessToken', { path: '/' });
			event.cookies.delete('refreshToken', { path: '/' });
		}
	}

	return resolve(event);
};
