<script lang="ts">
	import SidebarHeader from '../sidebar/SidebarHeader.svelte';
	import { Copy, Check } from 'lucide-svelte';
	import type { User } from '$lib/types';

	interface Props {
		user?: User | null;
		onClose?: () => void;
	}

	let { user, onClose }: Props = $props();

	// Derive display values from user
	let displayName = $derived(user ? `${user.firstName} ${user.lastName}` : 'Guest');
	let userId = $derived(user?.id?.slice(0, 8).toUpperCase() || 'N/A');
	let isAgent = $derived(user?.role === 'agent');

	let copied = $state(false);

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<section class="p-6 lg:p-10 max-w-7xl lg:max-w-6xl mx-auto space-y-6 lg:space-y-10 mt-10">
	<div class="flex items-center justify-between">
		<h1 class="text-xl lg:text-3xl font-semibold">Welcome, {user?.firstName || 'User'}</h1>
		<SidebarHeader {onClose} />
	</div>

	<div class="relative bg-white px-2 py-4 lg:px-6 lg:py-6 rounded-lg w-full mx-auto">
		<div class="absolute -top-6 lg:-top-10 left-6 z-10 flex flex-col items-center">
			<div
				class="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-primary flex items-center justify-center text-white text-2xl lg:text-4xl font-bold border-4 border-white"
			>
				{user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
			</div>
			<span
				class="mt-1 bg-[#1F2A1F] text-white text-xs lg:text-sm px-3 py-0.5 lg:px-4 lg:py-1 rounded-full capitalize"
			>
				{user?.role || 'Customer'}
			</span>
		</div>

		<div
			class="bg-secondary/13 backdrop-blur rounded-lg shadow-md px-2 py-4 lg:px-8 lg:py-6 pl-22 lg:pl-32 mb-5"
		>
			<div class="flex items-center justify-between">
				<div>
					<p class="font-semibold text-sm lg:text-2xl text-gray-900">
						{displayName}
					</p>
					<p class="text-xs lg:text-xl text-gray-500">
						{user?.email || 'No email'}
					</p>
				</div>

				<div class="text-right flex items-center gap-1 md:gap-2 mb-3">
					<p
						class="text-[10px] md:text-lg px-1 md:px-2 rounded-full bg-white text-gray-500"
					>
						User ID
					</p>
					<p class="text-xs md:text-lg font-medium text-gray-700">
						{userId}
					</p>
				</div>
			</div>
		</div>

		<div class="bg-white rounded-2xl pb-6 lg:pb-10 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.15)]">
			<div class="py-10 px-4 lg:px-10 flex items-center justify-between">
				<div>
					<h2 class="font-semibold text-md md:text-2xl">Project Information</h2>

					<div
						class="relative w-24 h-24 lg:w-36 lg:h-36 flex items-center justify-center mt-4"
					>
						<div
							class="absolute inset-0 rounded-full"
							style="
                background:
                  conic-gradient(
                    from -120deg,
                    #22c55e 0% 50%,
                    transparent 50% 54%,
                    #9ca3af 54% 84%,
                    transparent 84% 88%,
                    #1f2937 88% 96%,
                    transparent 96% 100%
                  );
                -webkit-mask:
                  radial-gradient(circle, transparent 56%, black 58%);
                mask:
                  radial-gradient(circle, transparent 56%, black 58%);
              "
						></div>

						<span class="font-semibold text-lg lg:text-2xl"> 100% </span>
					</div>
				</div>

				{#if isAgent}
					<div>
						<h1 class="font-semibold text-md md:text-2xl">
							Agent Rating
							<span class="block md:text-md">Consistent</span>
						</h1>
						<div class="flex gap-1 text-sm md:text-xl mb-2">
							<span class="text-green-500">★</span>
							<span class="text-green-500">★</span>
							<span class="text-green-500">★</span>
							<span class="text-gray-300">★</span>
							<span class="text-gray-300">★</span>
						</div>

						<p class="text-sm lg:text-lg font-semibold">Referral Code</p>

						<div class="flex items-center gap-2 mt-2">
							<span class="text-sm lg:text-lg font-medium">
								{userId}
							</span>

							<button
								type="button"
								class="text-green-500 hover:text-green-600"
								aria-label="Copy referral code"
								onclick={() => copyToClipboard(userId)}
							>
								{#if copied}
									<Check size={18} />
								{:else}
									<Copy size={18} />
								{/if}
							</button>
						</div>
						<a
							href={`/signup/${userId}`}
							class="text-primary underline text-sm lg:text-base max-w-24 md:max-w-44 truncate inline-block align-middle"
						>
							Share referral link
						</a>
					</div>
				{:else}
					<div>
						<h2 class="font-semibold text-md md:text-2xl">Account Status</h2>
						<p class="text-sm lg:text-lg text-gray-600 mt-2">
							{#if user?.isVerified}
								<span class="text-green-500">✓</span> Email Verified
							{:else}
								<span class="text-yellow-500">!</span> Email Not Verified
							{/if}
						</p>
						<p class="text-sm lg:text-lg text-gray-600">
							{#if user?.isActive}
								<span class="text-green-500">✓</span> Account Active
							{:else}
								<span class="text-red-500">✗</span> Account Inactive
							{/if}
						</p>
					</div>
				{/if}
			</div>

			<div class="flex text-[10px] lg:text-sm gap-4 lg:gap-8 justify-center">
				<div class="flex items-center gap-1">
					<p>Completed Projects</p>
					<div class="bg-primary p-1 lg:p-2 rounded-full"></div>
				</div>

				<div class="flex items-center gap-1">
					<p>Pending Projects</p>
					<div class="bg-gray-400 p-1 lg:p-2 rounded-full"></div>
				</div>

				<div class="flex items-center gap-1">
					<p>Fractured Projects</p>
					<div class="bg-black p-1 lg:p-2 rounded-full"></div>
				</div>
			</div>
		</div>
	</div>
</section>
