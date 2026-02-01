import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const isChatOpen = writable(false);

// Visitor ID persists in localStorage so the backend can resume chat history
// across page reloads without requiring the user to log in.
const VISITOR_ID_KEY = 'eco_chat_visitor_id';
const SESSION_ID_KEY = 'eco_chat_session_id';

/**
 * Get or create a persistent visitor ID (UUID stored in localStorage)
 */
export function getVisitorId(): string {
	if (!browser) return '';

	let id = localStorage.getItem(VISITOR_ID_KEY);
	if (!id) {
		id = crypto.randomUUID();
		localStorage.setItem(VISITOR_ID_KEY, id);
	}
	return id;
}

/**
 * Get the stored session ID (the ChatSession primary key)
 */
export function getStoredSessionId(): string | null {
	if (!browser) return null;
	return localStorage.getItem(SESSION_ID_KEY);
}

/**
 * Store the active session ID
 */
export function setStoredSessionId(id: string): void {
	if (!browser) return;
	localStorage.setItem(SESSION_ID_KEY, id);
}

/**
 * Clear the stored session (e.g. when session ends)
 */
export function clearStoredSession(): void {
	if (!browser) return;
	localStorage.removeItem(SESSION_ID_KEY);
}
