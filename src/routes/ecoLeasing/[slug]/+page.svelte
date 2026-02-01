<script lang="ts">
  import { onMount } from "svelte";
  import SidebarHeader from "../../../components/sidebar/SidebarHeader.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { equipmentApi } from "$lib/api/client";
  import type { Equipment } from "$lib/types";

  export let onClose: (() => void) | undefined;

  let equipment: Equipment | null = null;
  let loading = true;
  let error: string | null = null;
  let activeImage = "";

  // Thumbnail scroll container
  let scrollContainer: HTMLDivElement;

  onMount(async () => {
    await loadEquipment();
  });

  async function loadEquipment() {
    loading = true;
    error = null;
    try {
      const data = await equipmentApi.getBySlug($page.params.slug);
      equipment = data.equipment;
      if (equipment.media && equipment.media.length > 0) {
        activeImage = equipment.media[0].url;
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load equipment";
    } finally {
      loading = false;
    }
  }

  // mode from URL
  $: mode = $page.url.searchParams.get("mode") ?? "all";
  $: isSale = mode === "sale";
  $: isLease = mode === "lease";

  function handleBookInspection() {
    goto(`/ecoLeasing/${$page.params.slug}/inspect?mode=${mode}`);
  }

  function handleRent() {
    const ref = $page.url.searchParams.get("ref");
    goto(`/ecoLeasing/${$page.params.slug}/lease?mode=${mode}${ref ? `&ref=${ref}` : ""}`);
  }

  function formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function scrollThumbnails(direction: "left" | "right") {
    if (!scrollContainer) return;
    const scrollAmount = 200;
    scrollContainer.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
</script>

<section class="min-h-screen bg-tertiary p-4 md:px-30 mt-14">
  <div class="flex items-center justify-between">
    <h1 class="text-lg md:text-2xl font-semibold mb-4 px-4">Equipment</h1>
    <SidebarHeader {onClose}/>
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="text-center py-20 px-4">
      <p class="text-red-500 mb-4">{error}</p>
      <button
        onclick={loadEquipment}
        class="px-4 py-2 bg-primary text-white rounded-md"
      >
        Retry
      </button>
    </div>
  {:else if equipment}
    <div class="mt-10 mx-auto max-w-6xl bg-white/50 p-4 rounded-xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">

        <!-- IMAGE SECTION -->
        <div class="bg-white shadow-sm p-6 rounded-2xl flex flex-col justify-center">
          {#if activeImage}
            <img
              src={activeImage}
              alt={equipment.name}
              class="h-72 lg:h-96 object-contain"
            />
          {:else}
            <div class="h-72 lg:h-96 flex items-center justify-center bg-gray-100 rounded-lg">
              <svg class="w-16 h-16 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
          {/if}

          <!-- MOBILE DETAILS -->
          <div class="block lg:hidden mt-6">
            <h2 class="text-xl font-semibold mb-3">
              {equipment.name}
            </h2>

            {#if equipment.description}
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {equipment.description}
              </p>
            {/if}

            {#if equipment.capacity || equipment.condition || equipment.manufacturer || equipment.model}
              <div class="flex flex-wrap gap-2 mb-4 text-xs text-gray-600">
                {#if equipment.manufacturer}
                  <span class="bg-gray-100 px-2 py-1 rounded">{equipment.manufacturer}</span>
                {/if}
                {#if equipment.model}
                  <span class="bg-gray-100 px-2 py-1 rounded">{equipment.model}</span>
                {/if}
                {#if equipment.capacity}
                  <span class="bg-gray-100 px-2 py-1 rounded">{equipment.capacity}</span>
                {/if}
                {#if equipment.condition}
                  <span class="bg-gray-100 px-2 py-1 rounded capitalize">{equipment.condition}</span>
                {/if}
              </div>
            {/if}

            <!-- Price -->
            {#if equipment.price}
              <div class="bg-gray-50 rounded-lg px-3 py-2 mb-4 inline-block">
                <p class="text-[10px] text-gray-400 uppercase">Price</p>
                <p class="text-sm font-semibold">{formatCurrency(Number(equipment.price))}</p>
              </div>
            {/if}

            <div class="flex items-center gap-3">
              {#if equipment.isAvailable}
                <span
                  class="text-sm px-4 py-1 rounded-full border border-primary text-primary shadow"
                >
                  Available
                </span>
              {/if}

              <!-- ACTION BUTTONS (MOBILE) -->
              <div class="ml-auto flex gap-3">
                {#if isSale}
                  <button
                    onclick={handleBookInspection}
                    class="px-5 py-2 text-xs md:text-sm rounded-full bg-primary text-white shadow"
                  >
                    Book Inspection
                  </button>
                {:else if isLease}
                  <button
                    onclick={handleRent}
                    class="px-5 py-2 text-xs md:text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {:else}
                  <button
                    onclick={handleBookInspection}
                    class="px-5 py-2 text-xs md:text-sm rounded-full bg-primary text-white shadow"
                  >
                    Book Inspection
                  </button>

                  <button
                    onclick={handleRent}
                    class="px-5 py-2 text-xs md:text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP DETAILS -->
        <div class="flex flex-col gap-4 mt-6">
          <div class="bg-white hidden lg:block p-6 rounded-2xl shadow-sm">
            <h2 class="text-xl font-semibold mb-3">
              {equipment.name}
            </h2>

            {#if equipment.description}
              <p class="text-sm text-gray-500 leading-relaxed mb-4">
                {equipment.description}
              </p>
            {/if}

            {#if equipment.capacity || equipment.condition || equipment.manufacturer || equipment.model}
              <div class="flex flex-wrap gap-2 mb-4 text-sm text-gray-600">
                {#if equipment.manufacturer}
                  <span class="bg-gray-100 px-3 py-1 rounded">{equipment.manufacturer}</span>
                {/if}
                {#if equipment.model}
                  <span class="bg-gray-100 px-3 py-1 rounded">{equipment.model}</span>
                {/if}
                {#if equipment.capacity}
                  <span class="bg-gray-100 px-3 py-1 rounded">{equipment.capacity}</span>
                {/if}
                {#if equipment.condition}
                  <span class="bg-gray-100 px-3 py-1 rounded capitalize">{equipment.condition}</span>
                {/if}
              </div>
            {/if}

            <!-- Price -->
            {#if equipment.price}
              <div class="bg-gray-50 rounded-lg px-4 py-3 mb-6 inline-block">
                <p class="text-xs text-gray-400 uppercase">Price</p>
                <p class="text-lg font-semibold">{formatCurrency(Number(equipment.price))}</p>
              </div>
            {/if}

            <div class="flex items-center gap-3">
              {#if equipment.isAvailable}
                <span
                  class="text-sm px-4 py-1 rounded-full border border-primary text-primary shadow"
                >
                  Available
                </span>
              {/if}

              <!-- ACTION BUTTONS (DESKTOP) -->
              <div class="ml-auto flex gap-3">
                {#if isSale}
                  <button
                    onclick={handleBookInspection}
                    class="px-5 py-2 text-sm rounded-full bg-primary text-white shadow"
                  >
                    Book Inspection
                  </button>
                {:else if isLease}
                  <button
                    onclick={handleRent}
                    class="px-5 py-2 text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {:else}
                  <button
                    onclick={handleBookInspection}
                    class="px-5 py-2 text-sm rounded-full bg-primary text-white shadow"
                  >
                    Book Inspection
                  </button>

                  <button
                    onclick={handleRent}
                    class="px-5 py-2 text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {/if}
              </div>
            </div>
          </div>

          <!-- THUMBNAILS with scrollable slider -->
          {#if equipment.media && equipment.media.length > 0}
            <div class="relative">
              {#if equipment.media.length > 4}
                <button
                  type="button"
                  onclick={() => scrollThumbnails("left")}
                  class="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-1 hidden md:flex items-center justify-center"
                >
                  <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onclick={() => scrollThumbnails("right")}
                  class="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow rounded-full p-1 hidden md:flex items-center justify-center"
                >
                  <svg class="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              {/if}

              <div
                bind:this={scrollContainer}
                class="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory px-2 py-1 justify-start"
                style="scrollbar-width: none; -ms-overflow-style: none;"
              >
                {#each equipment.media as media}
                  <button
                    type="button"
                    onclick={() => (activeImage = media.url)}
                    class="flex-shrink-0 snap-center p-2 rounded-lg border transition
                      {media.url === activeImage
                        ? 'border-primary ring-2 ring-primary'
                        : 'border-gray-300'}"
                  >
                    <img
                      src={media.thumbnailUrl || media.url}
                      alt="Thumbnail"
                      class="h-16 w-16 object-cover rounded-md"
                    />
                  </button>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  /* Hide scrollbar for webkit browsers */
  div::-webkit-scrollbar {
    display: none;
  }
</style>
