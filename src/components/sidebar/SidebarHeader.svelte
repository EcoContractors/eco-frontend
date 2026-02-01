<script lang="ts">
	import { ArrowLeft } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	interface Props {
		onClose?: () => void;
	}

	let { onClose }: Props = $props();

	function handleBack() {
		onClose?.();

		if (typeof window !== 'undefined' && window.history.length > 1) {
			window.history.back();
		} else {
			goto('/');
		}
	}
</script>

<div class="flex items-center justify-between px-4 pt-4 pb-6">
	<button type="button" aria-label="Go back" class="ml-auto p-2 cursor-pointer" onclick={handleBack}>
		<ArrowLeft size={20} />
	</button>
</div>
