<script lang="ts">
	import { servicesCarouselData } from '$lib/data/servicesCarousel';
  import Carousel from '../../components/services/Carousel.svelte';
  import { services } from '$lib/data/services';
  import ServiceDetailCard from '../../components/services/ServiceDetailCard.svelte';
  import Testimonials from '../../components/services/Testimonials.svelte';
</script>

<div class="md:py-14 overflow-x-hidden">
	<Carousel slides={servicesCarouselData} autoplay={true} interval={4000} />
</div>
<div class="container mx-auto px-4 py-16">
	<!-- Section Header -->
	<div class="text-center mb-12">
		<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
		<p class="text-gray-600 max-w-2xl mx-auto">
			Comprehensive construction solutions tailored to meet your project needs. 
			From planning to execution, we deliver excellence at every stage.
		</p>
	</div>

	<!-- Services Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each services as service (service.id)}
			<ServiceDetailCard {service} />
		{/each}
	</div>
	<Testimonials />
</div>
