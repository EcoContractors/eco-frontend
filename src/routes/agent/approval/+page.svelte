<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Agent Approval - Eco Contractors</title>
</svelte:head>

<section class="flex items-center justify-center min-h-screen bg-gray-50 p-4 mt-14">
	<div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-md w-full text-center">
		{#if data.approvalStatus === 'success'}
			<div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
				<svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-3">Success!</h2>
			<p class="text-gray-500 mb-8 leading-relaxed">{data.message}</p>
			<a
				href="/"
				class="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
			>
				Go to Homepage
			</a>
		{:else if data.approvalStatus === 'error'}
			<div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
				<svg class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M18 6L6 18" />
					<path d="M6 6l12 12" />
				</svg>
			</div>
			<h2 class="text-2xl font-bold text-gray-900 mb-3">Error</h2>
			<p class="text-gray-500 mb-8 leading-relaxed">{data.message}</p>
			<a
				href="/"
				class="inline-block px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
			>
				Go to Homepage
			</a>
		{:else}
			<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-6"></div>
			<h2 class="text-2xl font-bold text-gray-900 mb-3">Processing...</h2>
			<p class="text-gray-500">Please wait while we process the agent approval.</p>
		{/if}
	</div>
</section>
