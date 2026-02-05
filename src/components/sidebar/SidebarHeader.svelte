<script lang="ts">
  import { goto } from '$app/navigation';
  import { logo1 } from '$lib/assets/images';
	import { X } from 'lucide-svelte';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	function handleClose() {
		onClose?.();
	}

	function goHome() {
		onClose?.(); 
		goto('/');
	}
</script>

<div class="flex items-center justify-between px-4 pt-4 pb-6">
	<div>
		<button
		type="button"
		aria-label="Go to home page"
		class="p-0 bg-transparent cursor-pointer order-2 md:order-1"
		onclick={goHome}
	>
		<img src={logo1} alt="Eco Contractors" class="w-24 object-fit" />
	</button>
	</div>
	<button 
		type="button" 
		aria-label="Close" 
		class="ml-auto p-2 cursor-pointer hover:text-red-600 transition-colors" 
		onclick={handleClose}
	>
		<X size={20} />
	</button>
</div>
