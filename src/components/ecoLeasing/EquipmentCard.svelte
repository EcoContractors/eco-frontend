<script lang="ts">
  export let images: string[];
  export let name: string;
  export let available: boolean;
  export let slug: string;
  export let mode: "all" | "sale" | "lease" = "all";
  export let agentRef: string | null;
</script>

<a href={`/ecoLeasing/${slug}?mode=${mode}${agentRef ? `&ref=${agentRef}` : ""}`} class="block">
  <div
  class="bg-white rounded-xl border border-green-300
         p-0.5 md:p-2 shadow-sm"
>
  <div class="relative">
    <img
      src={images[0]}
      alt={name}
      class="w-full h-28 object-cover rounded-lg"
    /> 
  </div>

  <div class="flex items-center justify-center md:justify-between gap-2 my-3 p-0.5 md:px-3">
    {#if available}
      <span
        class=" text-[10px] md:text-lg
               bg-white px-1 rounded-full
               border border-green-400 text-green-600"
      >
        Available
      </span>
    {/if}
    <p class=" text-[9px] md:text-[14px] lg:text-lg font-medium text-gray-700">
      {name}
    </p>
  </div>
</div>

</a>