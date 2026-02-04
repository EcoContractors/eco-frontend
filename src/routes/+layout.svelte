<script lang="ts">
	import '../app.css';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Header from '../components/landing/Header.svelte';
<<<<<<< HEAD
	import Toast from '../components/ui/Toast/Toast.svelte';
	import ChatWidget from '../components/chat/ChatWidget.svelte';
	import type { LayoutData } from './$types';
  import Footer from '../components/landing/Footer.svelte';
=======
	import Footer from '../components/landing/Footer.svelte';
	import Toast from '../components/ui/Toast/Toast.svelte';
	import ChatWidget from '../components/chat/ChatWidget.svelte';
	import type { LayoutData } from './$types';
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<Header isAuthenticated={data.isAuthenticated} user={data.user} />

	<div
		in:fly={{ x: 40, duration: 300, easing: cubicOut }}
		out:fade={{ duration: 150 }}
	>
		{@render children()}
	</div>
<<<<<<< HEAD
	<Footer />

=======

	<Footer />
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
	<Toast />
	<ChatWidget />
