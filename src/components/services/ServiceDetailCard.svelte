<script lang="ts">
	import type { Service } from '$lib/data/services';

	interface Props {
		service: Service;
	}

	let { service }: Props = $props();
</script>

<div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
	<!-- Image -->
	<div class="relative h-64 overflow-hidden">
		<img 
			src={service.image} 
			alt={service.title}
			class="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
		/>
		<div class="absolute top-0 left-0 right-0 bottom-0 bg-linear-to-b from-transparent to-black/60"></div>
		<h3 class="absolute bottom-4 left-6 text-white text-2xl font-bold">{service.title}</h3>
	</div>

	<!-- Content -->
	<div class="p-6">
		<p class="text-gray-700 text-sm mb-4 leading-relaxed">
			{service.fullDescription}
		</p>

		<!-- Features List -->
		<div class="mt-4">
			<h4 class="text-sm font-semibold text-gray-900 mb-3">Key Services:</h4>
			<ul class="space-y-2">
				{#each service.features as feature}
					<li class="flex items-start text-sm text-gray-600">
						<svg class="w-5 h-5 text-green-500 mr-2 shrink-0" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
						</svg>
						{feature}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>