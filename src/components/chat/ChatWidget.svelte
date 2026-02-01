<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, slide } from 'svelte/transition';
	import { MessageCircle, X, Send, Bot } from 'lucide-svelte';
	import { chatApi } from '$lib/api/client';
	import type { ChatMessage } from '$lib/types';
	import {
		isChatOpen,
		getVisitorId,
		getStoredSessionId,
		setStoredSessionId,
		clearStoredSession
	} from '$lib/stores/chat';
	import ChatLeadForm from './ChatLeadForm.svelte';

	let open = $state(false);
	let messages = $state<ChatMessage[]>([]);
	let inputText = $state('');
	let sending = $state(false);
	let sessionId = $state<string | null>(null);
	let initializing = $state(false);
	let messagesContainer: HTMLDivElement | undefined = $state();

	// Lead form state
	let showLeadForm = $state(false);
	let hasSubmittedLead = $state(false);
	let hasDismissedLead = $state(false);

	const WELCOME_MESSAGE: ChatMessage = {
		id: 'welcome',
		sessionId: '',
		senderType: 'bot',
		message:
			"Hi there! I'm the Eco Assistant. I can help you with questions about our construction services, equipment leasing, and more. How can I help you today?",
		createdAt: new Date().toISOString()
	};

	// Show the lead-capture form after 4 back-and-forth exchanges (8 messages).
	// Enough engagement to signal real interest without being annoying.
	const LEAD_TRIGGER_COUNT = 8;

	// Subscribe to store
	onMount(() => {
		const unsub = isChatOpen.subscribe((val) => {
			open = val;
		});
		return unsub;
	});

	function toggleChat() {
		open = !open;
		isChatOpen.set(open);
	}

	$effect(() => {
		if (open && !sessionId && !initializing) {
			initSession();
		}
	});

	$effect(() => {
		// Check if we should show the lead form
		if (
			messages.length >= LEAD_TRIGGER_COUNT &&
			!hasSubmittedLead &&
			!hasDismissedLead &&
			!showLeadForm
		) {
			showLeadForm = true;
		}
	});

	$effect(() => {
		// Scroll to bottom when messages change
		if (messagesContainer && messages.length > 0) {
			scrollToBottom();
		}
	});

	function scrollToBottom() {
		if (messagesContainer) {
			// Use requestAnimationFrame to ensure DOM has updated
			requestAnimationFrame(() => {
				if (messagesContainer) {
					messagesContainer.scrollTop = messagesContainer.scrollHeight;
				}
			});
		}
	}

	async function initSession() {
		initializing = true;
		try {
			const storedId = getStoredSessionId();
			const visitorId = getVisitorId();

			if (storedId) {
				// Try to load existing messages
				sessionId = storedId;
				try {
					const data = await chatApi.getMessages(storedId);
					if (data.messages.length > 0) {
						messages = data.messages;
					} else {
						messages = [WELCOME_MESSAGE];
					}
				} catch {
					// Session may have expired — create a new one
					sessionId = null;
					clearStoredSession();
				}
			}

			if (!sessionId) {
				const result = await chatApi.createSession(visitorId);
				sessionId = result.session.id;
				setStoredSessionId(result.session.id);

				if (result.resumed) {
					// Load existing messages
					const data = await chatApi.getMessages(result.session.id);
					messages = data.messages.length > 0 ? data.messages : [WELCOME_MESSAGE];
				} else {
					messages = [WELCOME_MESSAGE];
				}
			}
		} catch (err) {
			console.error('Failed to init chat session:', err);
			messages = [WELCOME_MESSAGE];
		} finally {
			initializing = false;
		}
	}

	async function sendMessage() {
		const text = inputText.trim();
		if (!text || sending || !sessionId) return;

		inputText = '';
		sending = true;

		// Optimistically add user message
		const tempUserMsg: ChatMessage = {
			id: 'temp-' + Date.now(),
			sessionId: sessionId,
			senderType: 'user',
			message: text,
			createdAt: new Date().toISOString()
		};
		messages = [...messages, tempUserMsg];

		try {
			const result = await chatApi.sendMessage(sessionId, text);
			// Replace temp message with real one and add bot response
			messages = [
				...messages.filter((m) => m.id !== tempUserMsg.id),
				result.userMessage,
				result.botMessage
			];
		} catch (err) {
			console.error('Failed to send message:', err);
			// Add error message from bot
			const errorMsg: ChatMessage = {
				id: 'error-' + Date.now(),
				sessionId: sessionId,
				senderType: 'bot',
				message: 'Sorry, I encountered an error. Please try again.',
				createdAt: new Date().toISOString()
			};
			messages = [...messages, errorMsg];
		} finally {
			sending = false;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	function handleLeadSubmitted() {
		hasSubmittedLead = true;
		showLeadForm = false;
	}

	function handleLeadDismissed() {
		hasDismissedLead = true;
		showLeadForm = false;
	}
</script>

<!-- Floating Chat Button -->
{#if !open}
	<button
		onclick={toggleChat}
		class="fixed bottom-6 right-6 z-[9998] flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition-transform hover:scale-105 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
		aria-label="Open chat"
		transition:fade={{ duration: 150 }}
	>
		<MessageCircle size={26} />
	</button>
{/if}

<!-- Chat Panel -->
{#if open}
	<div
		class="fixed bottom-0 right-0 z-[9998] flex flex-col bg-white shadow-2xl
			sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-xl
			max-sm:inset-0 max-sm:h-full max-sm:w-full"
		transition:fly={{ y: 20, duration: 200 }}
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between rounded-t-none px-4 py-3 sm:rounded-t-xl"
			style="background-color: #2A3025;"
		>
			<div class="flex items-center gap-2.5">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white"
				>
					<Bot size={18} />
				</div>
				<div>
					<p class="text-sm font-semibold text-white">Eco Assistant</p>
					<p class="text-[10px] text-green-300">Online</p>
				</div>
			</div>
			<button
				onclick={toggleChat}
				class="rounded-full p-1 text-gray-300 transition-colors hover:bg-white/10 hover:text-white"
				aria-label="Close chat"
			>
				<X size={20} />
			</button>
		</div>

		<!-- Messages Area -->
		<div
			bind:this={messagesContainer}
			class="flex-1 overflow-y-auto px-4 py-3 space-y-3"
			style="background-color: #f9fafb;"
		>
			{#if initializing}
				<div class="flex justify-center py-8">
					<div class="flex items-center gap-2 text-sm text-gray-400">
						<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0ms;"></div>
						<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 150ms;"></div>
						<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 300ms;"></div>
					</div>
				</div>
			{:else}
				{#each messages as msg (msg.id)}
					<div
						class="flex {msg.senderType === 'user' ? 'justify-end' : 'justify-start'}"
					>
						<div
							class="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed
								{msg.senderType === 'user'
									? 'bg-green-600 text-white rounded-br-md'
									: 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'}"
						>
							{msg.message}
						</div>
					</div>
				{/each}

				<!-- Typing indicator -->
				{#if sending}
					<div class="flex justify-start">
						<div
							class="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-gray-100 bg-white px-4 py-2.5 shadow-sm"
						>
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 0ms;"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 150ms;"></div>
							<div class="h-2 w-2 animate-bounce rounded-full bg-gray-400" style="animation-delay: 300ms;"></div>
						</div>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Lead Form (slides in above input) -->
		{#if showLeadForm && sessionId}
			<div transition:slide={{ duration: 200 }}>
				<ChatLeadForm
					{sessionId}
					onSubmitted={handleLeadSubmitted}
					onDismiss={handleLeadDismissed}
				/>
			</div>
		{/if}

		<!-- Input Area -->
		<div class="border-t border-gray-200 px-3 py-2.5">
			<div class="flex items-center gap-2">
				<input
					type="text"
					bind:value={inputText}
					onkeydown={handleKeydown}
					placeholder="Type a message..."
					disabled={sending || initializing}
					class="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:bg-gray-50"
				/>
				<button
					onclick={sendMessage}
					disabled={!inputText.trim() || sending || initializing}
					class="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 disabled:bg-gray-300"
					aria-label="Send message"
				>
					<Send size={16} />
				</button>
			</div>
		</div>
	</div>
{/if}
