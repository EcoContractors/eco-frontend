import type { Handle } from '@sveltejs/kit';
import { API_BASE_URL } from '$env/static/private';

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
							isVerified: true
						};
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
					isVerified: true
				};
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
