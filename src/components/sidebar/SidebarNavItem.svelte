<script lang="ts">
	import type { ComponentType } from 'svelte';

	interface Props {
		icon: ComponentType;
		label: string;
		onClick: () => void;
	}

	let { icon: Icon, label, onClick }: Props = $props();
</script>

<button
	onclick={onClick}
	class="flex items-center gap-3 px-4 py-3 w-full
         text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
>
	<Icon size={18} />
	<span class="text-sm">{label}</span>
</button>
