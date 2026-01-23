import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { API_BASE_URL } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();

		if (!API_BASE_URL) {
			return json({ message: 'API_BASE_URL is not set on the server' }, { status: 500 });
		}

		const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			},
			body: JSON.stringify(body)
		});

		const data = await res.json();

		if (!res.ok) {
			return json({ message: data.message || 'Signup failed' }, { status: res.status });
		}

		return json(data, { status: 201 });
	} catch (error) {
		console.error('Signup error:', error);
		return json({ message: 'Server error. Please try again.' }, { status: 500 });
	}
};
