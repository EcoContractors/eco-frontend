// See https://svelte.dev/docs/kit/types#app.d.ts

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}

		interface Locals {
			user: {
				id: string;
				email: string;
				firstName: string;
				lastName: string;
				role: string;
				phone?: string;
				isActive: boolean;
				isVerified: boolean;
				agentStatus?: AgentStatus; // Added agentStatus
			} | null;
			accessToken: string | null;
		}

		// Add AgentStatus enum definition
		enum AgentStatus {
			pending = 'pending',
			under_review = 'under_review',
			approved = 'approved',
			rejected = 'rejected'
		}

		interface PageData {
			user?: App.Locals['user'];
			isAuthenticated?: boolean;
		}

		// interface PageState {}
		// interface Platform {}
	}
}

export {};
