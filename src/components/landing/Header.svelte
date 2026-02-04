<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import logo1 from '../../lib/assets/images/logo1.png';
	import MobileSidebar from '../sidebar/MobileSidebar.svelte';
	import { goto } from '$app/navigation';
	import type { User } from '$lib/types';

	interface Props {
		isAuthenticated?: boolean;
		user?: User | null;
	}

	let { isAuthenticated = false, user = null }: Props = $props();

	let sidebarOpen = $state(false);

	function goHome() {
		sidebarOpen = false;
		goto('/');
	}

	async function handleLogout() {
		// Use form action for logout (server-side cookie clearing)
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/logout';
		document.body.appendChild(form);
		form.submit();
	}

<<<<<<< HEAD
	function handleLogin() {
		goto('/signin');
	}
=======
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
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
			<button
				type="button"
				onclick={handleLogout}
				class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300 mr-2"
			>
				Logout
			</button>
<<<<<<< HEAD
		{:else}
			<button
				type="button"
				onclick={handleLogin}
				class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 mr-2"
			>
				Login
			</button>
=======
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
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
