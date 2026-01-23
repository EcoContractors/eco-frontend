<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let isResending = $state(false);
</script>

<section class="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
	<div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
		{#if data.needsVerification}
			<!-- Show "check your email" message after registration -->
			<div class="mb-6">
				<svg
					class="w-16 h-16 mx-auto text-primary"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
					></path>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
			<p class="text-gray-600 mb-6">
				{data.message}
			</p>
			{#if data.email}
				<p class="text-sm text-gray-500 mb-6">
					We sent a verification link to <strong>{data.email}</strong>
				</p>
			{/if}

			<!-- Resend verification form -->
			{#if data.email}
				<form
					method="POST"
					action="?/resend"
					use:enhance={() => {
						isResending = true;
						return async ({ update }) => {
							await update();
							isResending = false;
						};
					}}
					class="mb-4"
				>
					<input type="hidden" name="email" value={data.email} />
					<button
						type="submit"
						disabled={isResending}
						class="text-primary hover:text-primary-dark font-medium text-sm disabled:opacity-50"
					>
						{isResending ? 'Sending...' : "Didn't receive the email? Resend"}
					</button>
				</form>
			{/if}

			{#if $page.form?.message}
				<div
					class="mb-4 p-3 rounded-lg text-sm {$page.form?.success
						? 'bg-green-100 text-green-700'
						: 'bg-red-100 text-red-700'}"
				>
					{$page.form.message}
				</div>
			{/if}

			<button
				onclick={() => goto('/signin')}
				class="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300"
			>
				Back to Sign In
			</button>
		{:else if data.success}
			<!-- Verification successful -->
			<h1 class="text-3xl font-bold text-green-600 mb-4">Email Verified!</h1>
			<p class="text-gray-700 text-lg mb-6">{data.message}</p>
			<button
				onclick={() => goto('/signin')}
				class="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition duration-300"
			>
				Go to Sign In
			</button>
		{:else}
			<!-- Verification failed -->
			<h1 class="text-3xl font-bold text-red-600 mb-4">Verification Failed</h1>
			<p class="text-gray-700 text-lg mb-6">{data.message}</p>
			<p class="text-gray-600 mb-6">
				Please check your email again or try
				<a href="/signup" class="text-primary hover:underline">registering</a>.
			</p>
			<button
				onclick={() => goto('/signin')}
				class="bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-500 transition duration-300"
			>
				Back to Sign In
			</button>
		{/if}
	</div>
</section>
