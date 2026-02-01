<script lang="ts">
	import { chatApi } from '$lib/api/client';
	import { X } from 'lucide-svelte';

	let {
		sessionId,
		onSubmitted,
		onDismiss
	}: {
		sessionId: string;
		onSubmitted: () => void;
		onDismiss: () => void;
	} = $props();

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let submitting = $state(false);
	let error = $state('');

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!name && !email && !phone) {
			error = 'Please fill in at least one field.';
			return;
		}
		error = '';
		submitting = true;
		try {
			await chatApi.submitLead(sessionId, { name, email, phone });
			onSubmitted();
		} catch (err: any) {
			error = err.message || 'Failed to submit. Please try again.';
		} finally {
			submitting = false;
		}
	}
</script>

<div class="bg-gray-50 border-t border-gray-200 p-3">
	<div class="flex items-center justify-between mb-2">
		<p class="text-xs font-semibold text-gray-700">
			Want us to follow up? Leave your details:
		</p>
		<button
			onclick={onDismiss}
			class="text-gray-400 hover:text-gray-600 p-0.5"
			aria-label="Dismiss"
		>
			<X size={14} />
		</button>
	</div>

	<form onsubmit={handleSubmit} class="space-y-2">
		<input
			type="text"
			placeholder="Name"
			bind:value={name}
			class="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
		/>
		<input
			type="email"
			placeholder="Email"
			bind:value={email}
			class="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
		/>
		<input
			type="tel"
			placeholder="Phone"
			bind:value={phone}
			class="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
		/>

		{#if error}
			<p class="text-xs text-red-500">{error}</p>
		{/if}

		<button
			type="submit"
			disabled={submitting}
			class="w-full py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-md transition-colors"
		>
			{submitting ? 'Submitting...' : 'Submit'}
		</button>
	</form>
</div>
