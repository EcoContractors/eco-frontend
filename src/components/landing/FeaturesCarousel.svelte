<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { featuresCarouselData } from "$lib/data/featuresCarouselData";

  let currentIndex = 0;
  const visibleSlides = 1;
  const intervalTime = 4000; // 4 seconds
  let interval: ReturnType<typeof setInterval>;

  function startAutoplay() {
    interval = setInterval(() => {
      currentIndex =
        currentIndex < featuresCarouselData.length - visibleSlides
          ? currentIndex + 1
          : 0;
    }, intervalTime);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  onMount(startAutoplay);
  onDestroy(stopAutoplay);
</script>

<section
  class="relative w-full overflow-hidden"
  aria-label="Features carousel"
  on:mouseenter={stopAutoplay}
  on:mouseleave={startAutoplay}
>

 
  <div
    class="flex transition-transform duration-700 ease-in-out"
    style="transform: translateX(-{currentIndex * 100}%);"
  >
    {#each featuresCarouselData as feature (feature.title)}
      <div class="min-w-full ">
        <div class="relative h-48 rounded-xl overflow-hidden group">
        
          <img
            src={feature.image}
            alt={feature.title}
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div class="absolute inset-0 bg-black/30"></div>

          <div class="absolute bottom-4 left-4 right-4">
            <h3 class="text-white text-3xl font-semibold leading-tight">
              {feature.title}
            </h3>
          </div>
        </div>
      </div>
    {/each}
  </div>
</section>
