<script lang="ts">
  import FeaturesCarousel from "./FeaturesCarousel.svelte";
  import { Play } from "lucide-svelte";

  let videoEl: HTMLVideoElement;
  let isPlaying = false;

  function playVideo() {
    if (!videoEl) return;
    videoEl.play();
    isPlaying = true;
  }

  function togglePlayback() {
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      isPlaying = true;
    } else {
      videoEl.pause();
      isPlaying = false;
    }
  }
</script>

<section class="px-4 md:mx-4 rounded-2xl bg-transparent md:bg-white md:mt-20">
  <h1 class="font-bold text-xl px-4 pt-6">Features</h1>

  <!-- Mobile -->
  <div class="my-6 block md:hidden">
    <FeaturesCarousel />
  </div>

  <!-- Desktop Video -->
  <div class="hidden md:block p-3 w-full h-[70vh] relative">
    <video
      bind:this={videoEl}
      class="w-full h-full object-cover rounded-xl"
      loop
      playsinline
      preload="metadata"
      on:pause={() => (isPlaying = false)}
      on:play={() => (isPlaying = true)}
    >
      <source src="/video/hero.mp4" type="video/mp4" />
    </video>

    {#if !isPlaying}
      <button
        type="button"
        aria-label="Play video"
        on:click={playVideo}
        class="absolute inset-0 flex items-center justify-center"
      >
        <div
          class="bg-black/60 backdrop-blur
                 rounded-full p-6
                 hover:scale-105 transition"
        >
          <Play size="40" class="text-white" />
        </div>
      </button>
    {/if}

    {#if isPlaying}
      <button
        type="button"
        on:click={togglePlayback}
        class="absolute bottom-6 right-6
               bg-black/60 text-white
               px-4 py-2 rounded-full
               text-sm font-medium
               backdrop-blur"
      >
        Pause
      </button>
    {/if}
  </div>

  <div class="bg-white rounded-xl p-5 shadow md:shadow-none mt-6">
    <p class="text-xl font-bold">
      Our Professional <span class="block text-primary">Services</span>
    </p>
  </div>
</section>
