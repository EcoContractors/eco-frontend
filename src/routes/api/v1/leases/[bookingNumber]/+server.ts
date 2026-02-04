import { env } from '$env/dynamic/private';

const API_BASE_URL = env.API_BASE_URL ?? 'http://localhost:5000';

export async function GET({ params }: { params: { bookingNumber: string } }) {
	const targetUrl = `${API_BASE_URL}/api/v1/leases/${encodeURIComponent(params.bookingNumber)}`;

	try {
		const response = await fetch(targetUrl, {
			method: 'GET',
			headers: { 'Accept': 'application/json' },
		});

		const text = await response.text();

		try {
			const data = JSON.parse(text);
			return new Response(JSON.stringify(data), {
				status: response.status,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch {
			console.error(`[API Proxy] Non-JSON response from ${targetUrl}:`, text.substring(0, 200));
			return new Response(JSON.stringify({ message: 'Backend returned non-JSON response' }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	} catch (err) {
		console.error(`[API Proxy] Failed to fetch ${targetUrl}:`, err);
		return new Response(JSON.stringify({ message: 'Failed to connect to backend' }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
