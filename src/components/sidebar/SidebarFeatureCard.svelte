<script lang="ts">
	interface Props {
		title: string;
		subtitle: string;
		image: string;
		onClick?: () => void;
	}

	let { title, subtitle, image, onClick = () => {} }: Props = $props();
</script>

<div
	role="button"
	tabindex="0"
	onclick={onClick}
	onkeydown={(e) => e.key === 'Enter' && onClick()}
	class="mx-4 mb-4 flex items-center gap-3 bg-white p-3 rounded-md cursor-pointer"
>
	<img src={image} alt="Agents" class="w-10 h-10 rounded" />
	<div>
		<p class="text-sm font-medium">{title}</p>
		<p class="text-xs text-gray-500">{subtitle}</p>
	</div>
</div>
