<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import logo1 from '../../lib/assets/images/logo1.png';
	import MobileSidebar from '../sidebar/MobileSidebar.svelte';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/types';

	interface Props {
		isAuthenticated?: boolean;
		user?: User | null;
		pathname?: string;
	}

	let { user = null }: Props = $props();

	let sidebarOpen = $state(false);

	function goHome() {
		sidebarOpen = false;
		goto('/');
	}
</script>

<header class="fixed top-0 z-50 flex items-center px-4 py-3 bg-white shadow-md w-full">
	<!-- Logo -->
	<button
		type="button"
		aria-label="Go to home page"
		class="p-0 bg-transparent cursor-pointer order-2 md:order-1"
		onclick={goHome}
	>
		<img src={logo1} alt="Eco Contractors" class="w-24 object-fit" />
	</button>

	<div class="flex items-center ml-auto order-3 md:order-2">
		{#if isAuthenticated && user}
			<span class="mr-4 text-gray-700 font-medium">Hi, {user.firstName}</span>
		{/if}
		<!-- Menu icon -->
		<button
			type="button"
			aria-label="Open menu"
			class="p-1 cursor-pointer"
			onclick={() => (sidebarOpen = true)}
		>
			<Menu size={22} class="text-black" />
		</button>
	</div>
</header>

<MobileSidebar open={sidebarOpen} onClose={() => (sidebarOpen = false)} {user} />
