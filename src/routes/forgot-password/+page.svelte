<script lang="ts">
	import Button from '../../components/ui/Button.svelte';
	import SidebarHeader from '../../components/sidebar/SidebarHeader.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let isLoading = $state(false);
</script>

<section class="p-8 max-w-7xl mx-auto mt-14">
	<SidebarHeader />

	<div class="text-center mt-6 mb-8">
		<h1 class="text-3xl font-semibold text-gray-900">Forgot Password</h1>
		<p class="text-md md:text-xl text-gray-400 mt-5">
			Enter your email and we'll send you a reset link
		</p>
	</div>

	<div
		class="rounded-2xl border border-primary/40 bg-white/40 backdrop-blur-xl shadow-xl p-6 w-full md:w-lg lg:w-xl mx-auto"
	>
		{#if $page.form?.success}
			<!-- Success state -->
			<div class="text-center py-8">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
				<p class="text-gray-600 mb-6">
					If an account exists for <span class="font-medium">{$page.form.email}</span>, we've sent password reset instructions to that address.
				</p>
				<p class="text-sm text-gray-500 mb-6">
					Didn't receive the email? Check your spam folder or try again.
				</p>
				<a
					href="/signin"
					class="inline-block px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition"
				>
					Back to Sign In
				</a>
			</div>
		{:else}
			<!-- Form state -->
			<form
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
				class="space-y-4"
			>
				{#if $page.form?.message}
					<div
						class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mx-auto w-full md:max-w-md"
					>
						{$page.form.message}
					</div>
				{/if}

				<div class="relative w-full md:max-w-md mx-auto">
					<input
						type="email"
						placeholder="Email Address"
						name="email"
						required
						value={$page.form?.email || ''}
						class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div class="flex justify-center mt-6">
					<Button
						type="submit"
						label={isLoading ? 'Sending...' : 'Send Reset Link'}
						width="220px"
						disabled={isLoading}
					/>
				</div>

				<p class="text-xs text-center text-gray-400 mt-4">
					Remember your password?
					<a href="/signin" class="text-primary font-medium"> Sign in </a>
				</p>
			</form>
		{/if}
	</div>
</section>
