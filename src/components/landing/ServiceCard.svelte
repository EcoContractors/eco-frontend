<script lang="ts">
	import Button from '../ui/Button.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		image: string;
		title: string;
		description: string;
		onAction?: () => void;
<<<<<<< HEAD
	}

	let { image, title, description, onAction }: Props = $props();
=======
		route?: string; // Add optional route prop
	}

	let { image, title, description, onAction, route }: Props = $props();
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d

	function handleAction() {
		if (onAction) {
			onAction();
<<<<<<< HEAD
=======
		} else if (route) {
			goto(route);
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
		} else {
			goto('/services');
		}
	}
</script>

<div
	class="bg-white md:bg-transparent rounded-2xl shadow-sm md:shadow-none flex flex-col md:flex-row md:gap-10"
>
	<div class="p-3">
		<img src={image} alt={title} class="w-full h-56 md:h-full rounded-xl object-cover" />
	</div>

	<div class="p-6 flex flex-col justify-center md:w-1/2 lg:w-7/12">
		<h3 class="text-xl font-semibold text-gray-900 mb-2">
			{title}
		</h3>

		<p class="text-gray-500 leading-relaxed mb-4">
			{description}
		</p>

		<div class="mt-6 md:ml-auto">
			<Button label="See more" onClick={handleAction} />
		</div>
	</div>
<<<<<<< HEAD
</div>
=======
</div>
>>>>>>> 00909ae14be6882887ec6586b70d3e8fefb4ae8d
