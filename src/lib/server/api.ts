import { env } from '$env/dynamic/private';

const API_BASE_URL = env.API_BASE_URL ?? 'http://localhost:5000';

export interface ApiError {
	message: string;
	status: number;
}

export class ServerApiError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.status = status;
		this.name = 'ServerApiError';
	}
}

interface FetchOptions extends RequestInit {
	token?: string;
}

/**
 * Server-side API client for making requests to the backend
 */
export async function serverFetch<T>(
	endpoint: string,
	options: FetchOptions = {}
): Promise<T> {
	const { token, ...fetchOptions } = options;

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(fetchOptions.headers as Record<string, string>)
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const url = `${API_BASE_URL}/api/v1${endpoint}`;

	const response = await fetch(url, {
		...fetchOptions,
		headers
	});

	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		throw new ServerApiError(
			data.message || `Request failed with status ${response.status}`,
			response.status
		);
	}

	return data as T;
}

/**
 * Server API helper methods
 */
export const serverApi = {
	get: <T>(endpoint: string, token?: string) =>
		serverFetch<T>(endpoint, { method: 'GET', token }),

	post: <T>(endpoint: string, body?: unknown, token?: string) =>
		serverFetch<T>(endpoint, {
			method: 'POST',
			body: body ? JSON.stringify(body) : undefined,
			token
		}),

	put: <T>(endpoint: string, body?: unknown, token?: string) =>
		serverFetch<T>(endpoint, {
			method: 'PUT',
			body: body ? JSON.stringify(body) : undefined,
			token
		}),

	patch: <T>(endpoint: string, body?: unknown, token?: string) =>
		serverFetch<T>(endpoint, {
			method: 'PATCH',
			body: body ? JSON.stringify(body) : undefined,
			token
		}),

	delete: <T>(endpoint: string, token?: string) =>
		serverFetch<T>(endpoint, { method: 'DELETE', token })
};
