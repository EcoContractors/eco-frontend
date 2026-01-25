<script lang="ts">
	import Button from '../../components/ui/Button.svelte';
	import SidebarHeader from '../../components/sidebar/SidebarHeader.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
</script>

<section class="p-8 max-w-7xl mx-auto mt-14">
	<SidebarHeader />

	<div class="text-center mt-6 mb-8">
		<h1 class="text-3xl font-semibold text-gray-900">Reset Password</h1>
		<p class="text-md md:text-xl text-gray-400 mt-5">
			Create a new password for your account
		</p>
	</div>

	<div
		class="rounded-2xl border border-primary/40 bg-white/40 backdrop-blur-xl shadow-xl p-6 w-full md:w-lg lg:w-xl mx-auto"
	>
		{#if $page.form?.tokenInvalid}
			<!-- Token invalid/expired state -->
			<div class="text-center py-8">
				<div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
					<svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-gray-900 mb-2">Link Expired</h2>
				<p class="text-gray-600 mb-6">
					{$page.form.message || 'This password reset link has expired or is invalid.'}
				</p>
				<a
					href="/forgot-password"
					class="inline-block px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition"
				>
					Request New Reset Link
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
				{#if $page.form?.message && !$page.form?.tokenInvalid}
					<div
						class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mx-auto w-full md:max-w-md"
					>
						{$page.form.message}
					</div>
				{/if}

				<div class="relative w-full md:max-w-md mx-auto">
					<input
						type={showPassword ? 'text' : 'password'}
						placeholder="New Password"
						name="password"
						required
						minlength="8"
						class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
					/>

					<button
						type="button"
						class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
						onclick={() => (showPassword = !showPassword)}
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<div class="w-full md:max-w-md mx-auto">
					<p class="text-xs text-gray-500 mb-3">Password must contain:</p>
					<ul class="text-xs text-gray-500 space-y-1 list-disc list-inside">
						<li>At least 8 characters</li>
						<li>One uppercase letter</li>
						<li>One lowercase letter</li>
						<li>One number</li>
						<li>One special character (!@#$%^&* etc.)</li>
					</ul>
				</div>

				<div class="relative w-full md:max-w-md mx-auto">
					<input
						type={showConfirmPassword ? 'text' : 'password'}
						placeholder="Confirm New Password"
						name="confirmPassword"
						required
						minlength="8"
						class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
					/>

					<button
						type="button"
						class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
					>
						{showConfirmPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<div class="flex justify-center mt-6">
					<Button
						type="submit"
						label={isLoading ? 'Resetting...' : 'Reset Password'}
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
