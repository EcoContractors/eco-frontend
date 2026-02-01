<script lang="ts">
  export let image: string;
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
    {#if image}
      <img
        src={image}
        alt={name}
        class="w-full h-28 object-cover rounded-lg"
      />
    {:else}
      <div class="w-full h-28 rounded-lg bg-gray-200 flex items-center justify-center">
        <svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </div>
    {/if}
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
