<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { testimonials } from '$lib/data/testimonials';
	import TestimonialCard from './TestimonialCard.svelte';

	let currentIndex = 0;
	let interval: number;
	let containerWidth = 0;
	let isTransitioning = false;
	let hoveredId: number | null = null;
	let touchStartX = 0;
	let touchEndX = 0;

	// Determine how many cards to show based on screen width
	$: cardsToShow = containerWidth >= 1024 ? 3 : containerWidth >= 768 ? 2 : 1;
	$: maxIndex = Math.max(0, testimonials.length - cardsToShow);

	function nextSlide() {
		if (isTransitioning) return;
		isTransitioning = true;
		currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
		setTimeout(() => (isTransitioning = false), 500);
	}

	function prevSlide() {
		if (isTransitioning) return;
		isTransitioning = true;
		currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
		setTimeout(() => (isTransitioning = false), 500);
	}

	function goToSlide(index: number) {
		if (isTransitioning) return;
		isTransitioning = true;
		currentIndex = index;
		setTimeout(() => (isTransitioning = false), 500);
	}

	function startAutoplay() {
		interval = setInterval(() => {
			nextSlide();
		}, 4000);
	}

	function stopAutoplay() {
		if (interval) {
			clearInterval(interval);
		}
	}

	function handleCardHover(id: number) {
		hoveredId = id;
		stopAutoplay();
	}

	function handleCardLeave() {
		hoveredId = null;
		startAutoplay();
	}

	// Touch/swipe handlers for mobile
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchMove(e: TouchEvent) {
		touchEndX = e.touches[0].clientX;
	}

	function handleTouchEnd() {
		if (touchStartX - touchEndX > 50) {
			// Swiped left
			nextSlide();
		}

		if (touchStartX - touchEndX < -50) {
			// Swiped right
			prevSlide();
		}
	}

	onMount(() => {
		startAutoplay();
	});

	onDestroy(() => {
		stopAutoplay();
	});

	// Calculate the number of dots needed
	$: dotsCount = maxIndex + 1;
</script>

<section class="py-8 md:py-16">
	<div class="container mx-auto px-2 sm:px-4">
		<!-- Section Header -->
		<div class="text-center mb-8 md:mb-12">
			<p class="text-primary text-xs md:text-sm font-semibold uppercase tracking-wide mb-2">
				What our customers say about us
			</p>
			<h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Testimonials</h2>
		</div>

		<!-- Testimonials Carousel -->
		<div class="relative w-full" bind:clientWidth={containerWidth}>
			<!-- Navigation Buttons - Hidden on mobile, shown on tablet and up -->
			<button
				on:click={prevSlide}
				class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 lg:-translate-x-4 md:-translate-x-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isTransitioning}
				aria-label="Previous testimonial"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</button>

			<button
				on:click={nextSlide}
				class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 lg:translate-x-4 md:translate-x-2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 items-center justify-center text-gray-600 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
				disabled={isTransitioning}
				aria-label="Next testimonial"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Testimonials Container with touch support -->
			<div 
				class="overflow-hidden py-6 md:py-8"
				on:touchstart={handleTouchStart}
				on:touchmove={handleTouchMove}
				on:touchend={handleTouchEnd}
			>
				<div
					class="flex transition-transform duration-500 ease-in-out gap-3 md:gap-6"
					style="transform: translateX(-{currentIndex * (100 / cardsToShow)}%)"
				>
					{#each testimonials as testimonial (testimonial.id)}
						<div
							class="shrink-0 relative w-full md:w-auto"
							style="{cardsToShow > 1 ? `width: calc(${100 / cardsToShow}% - ${(cardsToShow - 1) * 24 / cardsToShow}px)` : 'width: 100%'}"
							on:mouseenter={() => handleCardHover(testimonial.id)}
							on:mouseleave={handleCardLeave}
						>
							<TestimonialCard 
								{testimonial} 
								isHovered={hoveredId === testimonial.id}
								isDimmed={hoveredId !== null && hoveredId !== testimonial.id}
							/>
						</div>
					{/each}
				</div>
			</div>

			<!-- Dots Navigation -->
			<div class="flex justify-center gap-2 mt-6 md:mt-8">
				{#each Array(dotsCount) as _, i}
					<button
						on:click={() => goToSlide(i)}
						class="w-2 h-2 rounded-full transition-all duration-300 {i === currentIndex
							? 'bg-primary w-6 md:w-8'
							: 'bg-gray-300 hover:bg-gray-400'}"
						aria-label="Go to slide {i + 1}"
					/>
				{/each}
			</div>
		</div>
	</div>
</section>