<script lang="ts">
  import { Plus } from "lucide-svelte";
  import { faqs } from "$lib/data/faq";
  import { slide } from "svelte/transition";
  import backdrop from "$lib/assets/images/backdrop.jpg"

  let openIndex: number | null = null;

  function toggle(index: number) {
    openIndex = openIndex === index ? null : index;
  }
</script>

<section class="px-4 sm:px-6 md:px-12 mt-24">
  <div class="w-full mx-auto flex flex-col md:flex-row md:items-start gap-8">

    <div class="md:w-1/2 shrink-0 mt-5">
      <img
        src={backdrop}
        alt="Help and Support"
        class="w-full  object-cover"
      />
    </div>

    <!-- FAQ -->
    <div class="md:w-1/2 w-full">
      <h2 class="text-lg md:text-2xl font-bold text-black mt-4">How can we help you?</h2>

      <div class="flex flex-col gap-2 py-2 rounded">
        {#each faqs as faq, index}
          <div class="rounded-lg overflow-hidden bg-white py-2.5">

            <!-- Question Row -->
            <button
              class="w-full flex items-center justify-between px-4 py-3 text-left  transition text-black font-semibold cursor-pointer"
              on:click={() => toggle(index)}
            >
              <span class="text-sm text-gray-700">{faq.question}</span>
              <span class="shrink-0 ml-4 transition-transform duration-300" style="transform: rotate({openIndex === index ? 45 : 0}deg)">
                <Plus size={18} color="#16a34a" strokeWidth={2.5} />
              </span>
            </button>

            <!-- Answer -->
            {#if openIndex === index}
              <div transition:slide={{ duration: 700 }} class="px-4 pb-4 text-sm text-gray-500 leading-relaxed ">
                {faq.answer}
              </div>
            {/if}

          </div>
        {/each}
      </div>
    </div>

  </div>
</section>