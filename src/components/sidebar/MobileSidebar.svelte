<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { RectangleGoggles, Briefcase, Info, Headset } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { User, AgentStatus } from '$lib/types'; // Import User and AgentStatus
	import { addToast } from '../ui/Toast/toast'; // Import addToast

	import SidebarHeader from './SidebarHeader.svelte';
	import Search from '../ui/Search.svelte';
	import SidebarFeatureCard from './SidebarFeatureCard.svelte';
	import SidebarNavItem from './SidebarNavItem.svelte';
	import SidebarFooter from './SidebarFooter.svelte';
	import { image16 } from '$lib/assets/images';

	interface Props {
		open?: boolean;
		onClose: () => void;
		user?: User | null; // Accept user prop
	}

	let { open = false, onClose, user = null }: Props = $props(); // Destructure user

	let isDesktop = $state(false);

	function updateScreen() {
		isDesktop = window.innerWidth >= 768; // md breakpoint
	}

	onMount(() => {
		updateScreen();
		window.addEventListener('resize', updateScreen);
		return () => window.removeEventListener('resize', updateScreen);
	});
</script>

{#if open}
	<!-- Backdrop -->
	<button aria-label="Close sidebar" class="fixed inset-0 bg-black/40 z-40" onclick={onClose}
	></button>

	<!-- Sidebar -->
	<aside
		class="fixed top-0 h-full w-72 bg-gray-100 z-50 flex flex-col
           left-0 md:left-auto md:right-0"
		transition:fly={{
			x: isDesktop ? 300 : -300,
			duration: 250
		}}
	>
		<SidebarHeader {onClose} />
		<Search />

			<SidebarFeatureCard
				title="Agent portal"
				subtitle="Get the best agents."
				image={image16}
				onClick={() => {
					onClose();
					if (!user) {
						goto('/signin?redirectTo=/dashboard');
					} else if (user.role === 'agent') {
						if (user.agentStatus === AgentStatus.approved) {
							goto('/dashboard');
						} else {
							addToast(
								`Your agent application is currently ${user.agentStatus ?? 'pending'}. Please await admin approval.`,
								'info'
							);
						}
					} else {
						addToast('Only approved agents can access the agent portal.', 'info');
					}
				}}
			/>

		<div class="px-2 space-y-1">
			<SidebarNavItem
				icon={RectangleGoggles}
				label="Eco Leasing / Sales"
				onClick={() => {
					onClose();
					goto('/ecoLeasing');
				}}
			/>
			<SidebarNavItem
				icon={Briefcase}
				label="Services"
				onClick={() => {
					onClose();
					goto('/services');
				}}
			/>
			<SidebarNavItem
				icon={Info}
				label="About"
				onClick={() => {
					onClose();
					goto('/about');
				}}
			/>
			<SidebarNavItem
				icon={Info}
				label="Faq"
				onClick={() => {
					onClose();
					goto('/faq');
				}}
			/>
			<SidebarNavItem
				icon={Headset}
				label="Help"
				onClick={() => {
					onClose();
					goto('/help');
				}}
			/>
		</div>

		<SidebarFooter />
	</aside>
{/if}
