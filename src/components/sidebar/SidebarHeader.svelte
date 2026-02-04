<script lang="ts">
<<<<<<< HEAD
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';
=======
  import { goto } from '$app/navigation';
  import { logo1 } from '$lib/assets/images';
	import { X } from 'lucide-svelte';
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

<<<<<<< HEAD
	function handleBack() {
		onClose?.();

		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			goto('/');
		}
=======
	function handleClose() {
		onClose?.();
	}

	function goHome() {
		onClose?.(); 
		goto('/');
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
	}
</script>

<div class="flex items-center justify-between px-4 pt-4 pb-6">
<<<<<<< HEAD
	<button type="button" aria-label="Go back" class="ml-auto p-2 cursor-pointer" onclick={handleBack}>
		<ArrowLeft size={20} />
	</button>
</div>
=======
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
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
