<script lang="ts">
	interface Props {
		label?: string;
		width?: string;
		onClick?: () => void;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
	}

	let { label = 'Button', width = 'auto', onClick = () => {}, type = 'button', disabled = false }: Props = $props();
</script>

<button
	{type}
	style="width: {width}"
	onclick={onClick}
	{disabled}
	class="bg-primary hover:bg-green-700 border-2 border-white transition
         text-white text-sm font-medium shadow-lg
         px-5 py-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
>
	{label}
</button>
