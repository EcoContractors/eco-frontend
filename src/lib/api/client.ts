import { goto } from '$app/navigation';
import { browser } from '$app/environment';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
	const url = new URL(`${API_BASE_URL}${endpoint}`);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== null && value !== '') {
				url.searchParams.append(key, String(value));
			}
		});
	}

	return url.toString();
}

/**
 * Client-side API client
 * Note: With HTTP-only cookies, tokens are automatically sent with requests.
 * Token refresh is handled server-side in hooks.server.ts
 */
async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
	const { params, ...fetchOptions } = options;
	const url = buildUrl(endpoint, params);

	// Build headers
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(fetchOptions.headers as Record<string, string>)
	};

	const response = await fetch(url, {
		...fetchOptions,
		headers,
		credentials: 'include' // Include cookies in requests
	});

	// Handle 401 - redirect to login
	if (response.status === 401 && browser) {
		goto('/signin?redirectTo=' + encodeURIComponent(window.location.pathname));
		throw new Error('Session expired. Please login again.');
	}

	// Handle error responses
	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Request failed with status ${response.status}`);
	}

	return response.json();
}

/**
 * HTTP method helpers
 */
export const api = {
	get: <T>(endpoint: string, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: 'GET' }),

	post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'POST',
			body: data ? JSON.stringify(data) : undefined
		}),

	put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'PUT',
			body: data ? JSON.stringify(data) : undefined
		}),

	patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
		apiRequest<T>(endpoint, {
			...options,
			method: 'PATCH',
			body: data ? JSON.stringify(data) : undefined
		}),

	delete: <T>(endpoint: string, options?: RequestOptions) =>
		apiRequest<T>(endpoint, { ...options, method: 'DELETE' })
};

export const agentApi = {
	getPublicInfo: (code: string) => api.get<{ agent: { fullName: string } }>(`/agents/public/${code}`)
};

