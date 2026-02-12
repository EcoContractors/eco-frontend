<script lang="ts">
	import '../app.css';
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import Header from '../components/landing/Header.svelte';
	import Footer from '../components/landing/Footer.svelte';
	import Toast from '../components/ui/Toast/Toast.svelte';
	import ChatWidget from '../components/chat/ChatWidget.svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: any } = $props();
</script>

<Header isAuthenticated={data.isAuthenticated} user={data.user} pathname={data.pathname} />

	<div
		in:fly={{ x: 40, duration: 300, easing: cubicOut }}
		out:fade={{ duration: 150 }}
	>
		{@render children()}
	</div>

	<Footer />
	<Toast />
	<ChatWidget />
