<script lang="ts">
  import SidebarHeader from "../sidebar/SidebarHeader.svelte";
  import Search from "../ui/Search.svelte";
  import EquipmentCard from "./EquipmentCard.svelte";
  import { equipmentList } from "$lib/data/equipment";

  export let agentRef: string | null = null;
  if (!agentRef && typeof window !== "undefined") {
    agentRef = localStorage.getItem("agentRef");
  }


  let activeTab: "all" | "sale" | "lease" = "all";

  $: filteredEquipment =
    activeTab === "all"
      ? equipmentList
      : equipmentList.filter((item) => item.type === activeTab);
</script>

<section class="p-6 mt-14">
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

    <div class="mt-3">
      <Search />
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 px-4">
      {#each filteredEquipment as item}
        <EquipmentCard
          slug={item.slug}
          images={item.images}
          name={item.name}
          available={item.available}
          mode={activeTab}
          agentRef={agentRef}
        />
      {/each}
    </div>
  </div>
</section>
