<script lang="ts">
  import SidebarHeader from "../../../components/sidebar/SidebarHeader.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { equipmentList } from "$lib/data/equipment";
  import type { EquipmentItem } from "$lib/data/equipment";

  export let onClose: (() => void) | undefined;

  let activeImage: string;

  $: equipment = equipmentList.find(
    (item) => item.slug === $page.params.slug
  ) as EquipmentItem | undefined;

  $: if (equipment) {
    activeImage = equipment.images[0];
  }

  // mode from URL
  $: mode = $page.url.searchParams.get("mode") ?? "all";
  // single source of truth for logic
  $: isSale = mode === "sale";
  $: isLease = mode === "lease";

  function handleRequest() {
    goto(`/inspectionForm?slug=${equipment?.slug}&mode=${mode}`);
  }
</script>

<section class="min-h-screen bg-tertiary p-4 md:px-30 mt-14">
  <div class="flex items-center justify-between">
    <h1 class="text-lg md:text-2xl font-semibold mb-4 px-4">Equipment</h1>
    <SidebarHeader {onClose}/>
  </div>

  {#if equipment}
    <div class="mt-10 mx-auto max-w-6xl bg-white/50 p-4 rounded-xl">
      <div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-10">
        
        <!-- IMAGE SECTION -->
        <div class="bg-white shadow-sm p-6 rounded-2xl flex flex-col justify-center">
          <img
            src={activeImage}
            alt={equipment.name}
            class="h-72 lg:h-96 object-contain"
          />

          <!-- MOBILE DETAILS -->
          <div class="block lg:hidden mt-6">
            <h2 class="text-xl font-semibold mb-3">
              {equipment.name}
            </h2>

            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              amet, consectetur adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>

            <div class="flex items-center gap-3">
              {#if equipment.available}
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
                    on:click={handleRequest}
                    class="px-5 py-2 text-xs md:text-sm rounded-full bg-primary text-white shadow"
                  >
                    Request Appointment
                  </button>
                {:else if isLease}
                  <button
                    class="px-5 py-2 text-xs md:text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {:else}
                  <button
                    class="px-5 py-2 text-xs md:text-sm rounded-full bg-primary text-white shadow"
                  >
                    Request Appointment
                  </button>

                  <button
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

            <p class="text-sm text-gray-500 leading-relaxed mb-6">
              amet, consectetur adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet dolore magna aliquam erat volutpat.
            </p>

            <div class="flex items-center gap-3">
              {#if equipment.available}
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
                    on:click={handleRequest}
                    class="px-5 py-2 text-sm rounded-full bg-primary text-white shadow"
                  >
                    Request Appointment
                  </button>
                {:else if isLease}
                  <button
                    class="px-5 py-2 text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {:else}
                  <button
                    class="px-5 py-2 text-sm rounded-full bg-primary text-white shadow"
                  >
                    Request Appointment
                  </button>

                  <button
                    class="px-5 py-2 text-sm rounded-full border border-primary text-primary shadow"
                  >
                    Rent
                  </button>
                {/if}
              </div>
            </div>
          </div>

          <!-- THUMBNAILS -->
          <div class="flex gap-3 justify-center">
            {#each equipment.images as img}
              <button
                type="button"
                on:click={() => (activeImage = img)}
                class="p-2 rounded-lg border transition
                  {img === activeImage
                    ? 'border-primary ring-2 ring-primary'
                    : 'border-gray-300'}"
              >
                <img
                  src={img}
                  alt="Thumbnail"
                  class="h-16 w-16 object-cover rounded-md"
                />
              </button>
            {/each}
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
