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
			} | null;
			accessToken: string | null;
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
