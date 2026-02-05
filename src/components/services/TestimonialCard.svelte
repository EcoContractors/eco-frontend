<script lang="ts">
	import type { Testimonial } from '$lib/data/testimonials';

	export let testimonial: Testimonial;
	export let isHovered: boolean = false;
	export let isDimmed: boolean = false;
</script>

<div class="bg-white rounded-lg p-4 md:p-6 shadow-sm min-h-70 md:min-h-80 flex flex-col transition-all duration-300 {isHovered ? 'scale-105 shadow-2xl -translate-y-4 z-10' : ''} {isDimmed ? 'opacity-40 scale-95' : 'opacity-100'}">
	<!-- Avatar and Info -->
	<div class="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
		<div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
			{#if testimonial.image}
				<img src={testimonial.image} alt={testimonial.name} class="w-full h-full object-cover" />
			{:else}
				<div class="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-black/20 text-white font-semibold text-base md:text-lg">
					{testimonial.name.charAt(0)}
				</div>
			{/if}
		</div>
		<div>
			<h4 class="font-semibold text-gray-900 text-sm md:text-base">{testimonial.name}</h4>
			<p class="text-xs md:text-sm text-gray-500">{testimonial.position}</p>
		</div>
	</div>

	<!-- Rating Stars -->
	<div class="flex gap-1 mb-2 md:mb-3">
		{#each Array(5) as _, i}
			<svg
				class="w-3 h-3 md:w-4 md:h-4 {i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
				/>
			</svg>
		{/each}
	</div>

	<!-- Testimonial Text -->
	<p class="text-gray-600 text-xs md:text-sm leading-relaxed grow wrap-break-words">
		{testimonial.text}
	</p>

	<!-- Company -->
	{#if testimonial.company}
		<p class="text-[10px] md:text-xs text-gray-400 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
			{testimonial.company}
		</p>
	{/if}
</div>