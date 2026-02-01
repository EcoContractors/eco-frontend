import { goto } from '$app/navigation';
import { browser } from '$app/environment';

// All requests go to /api/v1/... which SvelteKit proxies to the Express backend,
// avoiding CORS issues in the browser. Auth cookies are forwarded automatically.
const API_BASE_URL = '/api/v1';

export interface RequestOptions extends RequestInit {
	params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build URL with query parameters
 */
function buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
	const fullPath = `${API_BASE_URL}${endpoint}`;
	// If API_BASE_URL is absolute, use URL constructor directly.
	// Otherwise, resolve against window.location.origin for relative paths.
	const url = fullPath.startsWith('http')
		? new URL(fullPath)
		: new URL(fullPath, typeof window !== 'undefined' ? window.location.origin : 'http://localhost');

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

import type {
	Equipment,
	BookInspectionRequest,
	BookInspectionResponse,
	CreateSessionResponse,
	SendMessageResponse,
	GetMessagesResponse,
	SubmitLeadResponse
} from '$lib/types';

export const equipmentApi = {
	getAll: (params?: { type?: string; search?: string; categoryId?: string }) =>
		api.get<{ equipment: Equipment[] }>('/equipment', { params }),

	getBySlug: (slug: string) =>
		api.get<{ equipment: Equipment }>(`/equipment/${slug}`)
};

export const appointmentApi = {
	book: (data: BookInspectionRequest) =>
		api.post<BookInspectionResponse>('/appointments', data)
};

export const chatApi = {
	createSession: (visitorId?: string) =>
		api.post<CreateSessionResponse>('/chat/sessions', visitorId ? { visitorId } : {}),

	sendMessage: (sessionId: string, message: string) =>
		api.post<SendMessageResponse>(`/chat/sessions/${sessionId}/messages`, { message }),

	getMessages: (sessionId: string) =>
		api.get<GetMessagesResponse>(`/chat/sessions/${sessionId}/messages`),

	submitLead: (sessionId: string, data: { name?: string; email?: string; phone?: string; company?: string }) =>
		api.post<SubmitLeadResponse>(`/chat/sessions/${sessionId}/lead`, data),

	endSession: (sessionId: string) =>
		api.post<{ session: any }>(`/chat/sessions/${sessionId}/end`)
};

