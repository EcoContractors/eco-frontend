<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { CarouselSlide } from '$lib/data/servicesCarousel';

	interface Props {
		slides: CarouselSlide[];
		autoplay?: boolean;
		interval?: number;
	}

	let { slides, autoplay = true, interval = 3000 }: Props = $props();

	let currentIndex = $state(0);
	let intervalId: number | undefined;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % slides.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + slides.length) % slides.length;
	}

	function goToSlide(index: number) {
		currentIndex = index;
	}

	onMount(() => {
		if (autoplay) {
			intervalId = setInterval(nextSlide, interval);
		}

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});
</script>

<div class="relative w-screen">
	<!-- Carousel Images -->
	<div class="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
		{#each slides as slide, index}
			<div
				class={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
			>
				<img src={slide.image} alt={slide.alt} class="w-full h-full object-cover" />
				
				<!-- Text Overlay -->
				<div class="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 sm:p-6 md:p-8">
					<h3 class="text-white text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{slide.title}</h3>
					<p class="text-white/90 text-sm sm:text-base md:text-lg">{slide.description}</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Previous Button -->
	<button
		type="button"
		class="absolute top-1/2 left-2 sm:left-4 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all"
		onclick={prevSlide}
		aria-label="Previous slide"
	>
		<ChevronLeft size={20} class="sm:w-6 sm:h-6" />
	</button>

	<!-- Next Button -->
	<button
		type="button"
		class="absolute top-1/2 right-2 sm:right-8 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 sm:p-2 rounded-full shadow-lg transition-all"
		onclick={nextSlide}
		aria-label="Next slide"
	>
		<ChevronRight size={20} class="sm:w-6 sm:h-6" />
	</button>

	<!-- Dots Indicator -->
	<div class="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
		{#each slides as _, index}
			<button
				type="button"
				class={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
				onclick={() => goToSlide(index)}
				aria-label="Go to slide {index + 1}"
			></button>
		{/each}
	</div>
</div>