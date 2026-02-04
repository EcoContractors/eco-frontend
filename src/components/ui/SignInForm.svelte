<script lang="ts">
	import { google, staff } from '$lib/assets/images';
	
	import Button from '../ui/Button.svelte';
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
  import { ArrowLeft } from 'lucide-svelte';

	let showPassword = $state(false);
	let isLoading = $state(false);
</script>

<section class="mt-14 max-w-7xl">
	<div class="p-6 lg:p-10 flex flex-col lg:flex-row lg:gap-24">
		<div class="font-semibold text-xl md:text-2xl pb-10 space-y-5">
			<h1 class="w-20">
				We are <span class="text-primary">Professionals</span>
			</h1>
			<p class="font-medium">Welcome to our agent portal</p>
		</div>
		<div>
			<div class="md:flex md:items-center md:justify-center px-4">
				<img src={staff} alt="" class="w-full md:w-sm lg:w-md" />
			</div>
			<form
				method="POST"
				use:enhance={() => {
					isLoading = true;
					return async ({ update }) => {
						await update();
						isLoading = false;
					};
				}}
				class="relative rounded-2xl border border-primary/50 bg-white/30 backdrop-blur shadow-xl p-6 w-full max-w-sm md:min-w-lg lg:min-w-xl mx-auto -mt-10"
			>
				{#if $page.data.verified}
					<div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
						Email verified successfully! You can now sign in.
					</div>
				{/if}

				{#if $page.data.reset}
					<div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm text-center">
						Password reset successful! You can now sign in with your new password.
					</div>
				{/if}

				{#if $page.form?.message}
					<div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
						{$page.form.message}
					</div>
				{/if}

				<div class="mb-4 w-full md:w-md mx-auto">
					<input
						type="email"
						name="email"
						placeholder="Email"
						required
						value={$page.form?.email || ''}
						class="w-full px-4 py-3 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-green-400"
					/>
				</div>

				<div class="mb-4 relative w-full md:w-md mx-auto">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						placeholder="Password"
						required
						class="w-full px-4 py-3 rounded-xl bg-white text-sm outline-none focus:ring-2 focus:ring-green-400"
					/>

					<button
						type="button"
						class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
						onclick={() => (showPassword = !showPassword)}
					>
						{showPassword ? '🙈' : '👁'}
					</button>
				</div>
				<div class="flex justify-center">
					<Button label={isLoading ? 'Signing in...' : 'Sign in'} type="submit" width="200px" disabled={isLoading} />
				</div>

				<p class="text-xs text-center text-gray-400 mt-3 cursor-pointer">
					<a href="/forgot-password" class="hover:text-primary">Forgot Password ?</a>
				</p>

				<div class="mt-8 text-center text-xs text-gray-400">Don't have an account ?</div>

				<a
					href="/signup"
					class="block w-full md:w-xs text-center py-3 rounded-full text-sm font-medium bg-white border border-green-500 text-green-600 hover:bg-green-50 transition shadow-md mt-5 mx-auto"
				>
					Create an account
				</a>

				<div class="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
					<span><img src={google} alt="" /></span>
					<span>Sign in with Google</span>
				</div>
			</form>
		</div>
		<div class="order-first lg:order-0">
			<ArrowLeft />
		</div>
	</div>
</section>
