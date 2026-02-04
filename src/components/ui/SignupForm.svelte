<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { google } from '$lib/assets/images';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { agentApi } from '$lib/api/client';
  import { ArrowLeft } from 'lucide-svelte';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let isLoading = $state(false);
	let referralCode = $state<string | null>(null);
	let referringAgentName = $state<string | null>(null);

	onMount(() => {
		const ref = $page.url.searchParams.get('ref');
		if (ref) {
			referralCode = ref;
			agentApi.getPublicInfo(ref).then(res => {
				if (res.agent) {
					referringAgentName = res.agent.fullName;
				}
			}).catch(console.error);
		}
	});
</script>

<section class="p-8 max-w-7xl mx-auto mt-14">
	<div class="flex items-center justify-between px-4 pt-4 pb-6">
		<button type="button" aria-label="Go back" class="ml-auto p-2 cursor-pointer" onclick={handleBack}>
			<ArrowLeft size={20} />
		</button>
	</div>

	<div class="text-center mt-6 mb-8">
		<h1 class="text-3xl font-semibold text-gray-900">Become an Agent</h1>
		<p class="text-md md:text-2xl text-gray-400 mt-5">Join our network of professional contractors</p>
	</div>

	<form
		method="POST"
		action="/signup"
		use:enhance={() => {
			isLoading = true;
			return async ({ update }) => {
				await update();
				isLoading = false;
			};
		}}
		class="rounded-2xl border border-primary/40 bg-white/40 backdrop-blur-xl shadow-xl p-6 space-y-4 w-full md:w-lg lg:w-xl mx-auto"
	>
		{#if $page.form?.message}
			<div
				class="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center mx-auto w-full md:max-w-md"
			>
				{$page.form.message}
			</div>
		{/if}

		{#if referringAgentName}
			<div
				class="p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm text-center mx-auto w-full md:max-w-md"
			>
				You are being referred by <strong>{referringAgentName}</strong>.
			</div>
		{/if}

		<div class="mx-auto w-full md:max-w-md">
			<div class="grid grid-cols-2 gap-3">
				<input
					type="text"
					placeholder="First Name"
					name="firstName"
					required
					value={$page.form?.firstName || ''}
					class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
				/>

				<input
					type="text"
					placeholder="Last Name"
					name="lastName"
					required
					value={$page.form?.lastName || ''}
					class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>
		</div>

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

		<div class="relative w-full md:max-w-md mx-auto">
			<input
				type="tel"
				placeholder="Phone Number (e.g. +2348012345678)"
				name="phone"
				value={$page.form?.phone || ''}
				class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
			/>
		</div>

		<div class="relative w-full md:max-w-md mx-auto">
			<input
				type={showPassword ? 'text' : 'password'}
				placeholder="Password"
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

		<p class="text-xs text-gray-400 px-0 md:px-2 lg:px-10">
			Must be at least 8 characters with uppercase, lowercase, number, and special character
		</p>

		<div class="relative w-full md:max-w-md mx-auto">
			<input
				type={showConfirmPassword ? 'text' : 'password'}
				placeholder="Confirm Password"
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

		<input type="hidden" name="role" value="agent" />
		{#if referralCode}
			<input type="hidden" name="referralCode" value={referralCode} />
		{/if}

		<div class="w-full md:max-w-md mx-auto my-6 border-t border-gray-300"></div>

		<div class="text-center text-xs text-gray-500 mb-4 px-4">
			<p>By signing up as an agent, your application will be reviewed by our team.</p>
			<p class="mt-1">You'll receive an email once your account is approved.</p>
		</div>

		<div class="flex justify-center mt-6">
			<Button
				type="submit"
				label={isLoading ? 'Submitting application...' : 'Submit Application'}
				width="220px"
				disabled={isLoading}
			/>
		</div>

		<p class="text-xs text-center text-gray-400 mt-4">
			Already have an account?
			<a href="/signin" class="text-primary font-medium"> Sign in </a>
		</p>

		<div class="flex items-center justify-center gap-2 text-xs text-gray-500 mt-6">
			<img src={google} alt="Google" class="w-4 h-4" />
			<span>Sign up with Google</span>
		</div>
	</form>
</section>
