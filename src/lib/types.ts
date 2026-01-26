export enum AgentStatus {
	pending = 'pending',
	under_review = 'under_review',
	approved = 'approved',
	rejected = 'rejected'
}

export interface User {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
	phone?: string;
	isActive: boolean;
	isVerified: boolean;
	agentStatus?: AgentStatus; // Added agentStatus
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AuthTokens {
	token: string;
	refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
	message: string;
	user: User;
}

export interface RegisterResponse {
	message: string;
	user: User;
}

export interface RefreshTokenResponse {
	accessToken?: string;
	token?: string;
	refreshToken?: string;
}

export interface TokenPayload {
	userId: string;
	email: string;
	role: string;
	firstName?: string;
	lastName?: string;
	exp: number;
	iat: number;
}

// General API response for simple messages
export interface ApiResponse {
	message: string;
	success?: boolean;
}

// Error response from API
export interface ApiErrorResponse {
	message: string;
	errors?: Record<string, string[]>;
}
