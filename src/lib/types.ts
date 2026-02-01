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

// Equipment types
export interface EquipmentCategory {
	id: string;
	name: string;
	slug: string;
}

export interface EquipmentMedia {
	id: string;
	url: string;
	thumbnailUrl?: string;
	isPrimary: boolean;
	displayOrder: number;
	mediaType: 'image' | 'video';
}

export interface Equipment {
	id: string;
	name: string;
	slug: string;
	description?: string;
	capacity?: string;
	condition?: 'excellent' | 'good' | 'fair';
	manufacturer?: string;
	model?: string;
	yearManufactured?: number;
	price: number;
	isAvailable: boolean;
	isFeatured: boolean;
	listingType: 'sale' | 'lease' | 'both';
	category?: EquipmentCategory;
	media: EquipmentMedia[];
}

// Appointment types
export interface Appointment {
	id: string;
	appointmentNumber: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	equipmentId?: string;
	scheduledDate: string;
	scheduledTime?: string;
	status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
	notes?: string;
	createdAt: string;
	equipment?: Equipment;
}

export interface BookInspectionRequest {
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	equipmentId: string;
	scheduledDate: string;
	notes?: string;
}

export interface BookInspectionResponse {
	message: string;
	appointment: {
		id: string;
		appointmentNumber: string;
		status: string;
	};
}

// Chat types
export interface ChatMessage {
	id: string;
	sessionId: string;
	senderType: 'user' | 'bot' | 'agent';
	message: string;
	createdAt: string;
}

export interface ChatSession {
	id: string;
	sessionId: string;
	userId?: string;
	visitorId?: string;
	startedAt: string;
	endedAt?: string;
	messageCount: number;
}

export interface ChatLead {
	id: string;
	sessionId: string;
	name?: string;
	email?: string;
	phone?: string;
	company?: string;
	status: string;
	createdAt: string;
}

export interface CreateSessionResponse {
	session: ChatSession;
	resumed: boolean;
}

export interface SendMessageResponse {
	userMessage: ChatMessage;
	botMessage: ChatMessage;
}

export interface GetMessagesResponse {
	messages: ChatMessage[];
}

export interface SubmitLeadResponse {
	lead: ChatLead;
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
