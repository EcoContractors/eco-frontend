<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { ArrowLeft } from "lucide-svelte";
  import EquipmentCard from "./EquipmentCard.svelte";
  import { equipmentApi } from "$lib/api/client";
  import type { Equipment } from "$lib/types";

  export let agentRef: string | null = null;
  if (!agentRef && typeof window !== "undefined") {
    agentRef = localStorage.getItem("agentRef");
  }

  let activeTab: "all" | "sale" | "lease" = "all";
  let equipment: Equipment[] = [];
  let loading = true;
  let error: string | null = null;
  let searchQuery = "";

  onMount(async () => {
    await loadEquipment();
  });

  async function loadEquipment() {
    loading = true;
    error = null;
    try {
      const data = await equipmentApi.getAll();
      equipment = data.equipment;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load equipment";
    } finally {
      loading = false;
    }
  }

  function handleBack() {
    goto('/');
  }

  $: filteredEquipment = equipment.filter((item) => {
    // Tab filter
    if (activeTab === "sale" && item.listingType !== "sale" && item.listingType !== "both") return false;
    if (activeTab === "lease" && item.listingType !== "lease" && item.listingType !== "both") return false;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.manufacturer?.toLowerCase().includes(query) ||
        item.model?.toLowerCase().includes(query) ||
        item.category?.name?.toLowerCase().includes(query)
      );
    }
    return true;
  });
</script>

<section class="p-6 mt-14 relative">
  <!-- Back Button - Fixed to top right -->
  <div class="absolute top-4 right-4 md:right-8 lg:right-10 z-10">
    <button
      type="button"
      aria-label="Go to home page"
      class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
      on:click={handleBack}
    >
      <ArrowLeft size={24} class="text-gray-700" />
    </button>
  </div>

  <div class="text-3xl font-semibold">
    <h1>Eco Leasing/ <span class="block text-primary">Sale</span></h1>
  </div>

  <div class="flex gap-6 mt-4 text-sm font-medium border-b border-gray-200">
    <button
      on:click={() => (activeTab = "all")}
      class={`pb-1 transition ${
        activeTab === "all"
          ? "text-primary border-b-2 border-primary"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      All
    </button>

    <button
      on:click={() => (activeTab = "sale")}
      class={`pb-1 transition ${
        activeTab === "sale"
          ? "text-primary border-b-2 border-primary"
          : "text-black hover:text-gray-600"
      }`}
    >
      Sale
    </button>

    <button
      on:click={() => (activeTab = "lease")}
      class={`pb-1 transition ${
        activeTab === "lease"
          ? "text-primary border-b-2 border-primary"
          : "text-black hover:text-gray-600"
      }`}
    >
      Lease
    </button>
  </div>

  <div class="my-10 bg-tertiary py-10 h-full rounded-lg">
    <h1 class="text-2xl font-semibold px-6">Equipment</h1>

    <div class="mt-3 px-4">
      <input
        type="text"
        placeholder="Search..."
        bind:value={searchQuery}
        class="mb-4 px-4 py-2 w-full
               border border-green-400 rounded-md
               focus:outline-none bg-white shadow-lg"
      />
    </div>

    {#if loading}
      <div class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    {:else if error}
      <div class="text-center py-20 px-4">
        <p class="text-red-500 mb-4">{error}</p>
        <button
          on:click={loadEquipment}
          class="px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
      </div>
    {:else if filteredEquipment.length === 0}
      <div class="text-center py-20 text-gray-500">
        <p>No equipment found</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-4">
        {#each filteredEquipment as item}
          <EquipmentCard
            slug={item.slug}
            image={item.media?.find((m) => m.isPrimary)?.url || item.media?.[0]?.url || ''}
            name={item.name}
            available={item.isAvailable}
            mode={activeTab}
            agentRef={agentRef}
          />
        {/each}
      </div>
    {/if}
  </div>
</section>