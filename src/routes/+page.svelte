<script lang="ts">
  import Hero from "../components/landing/Hero.svelte";
  import Features from "../components/landing/Features.svelte";
  import ServiceCard from "../components/landing/ServiceCard.svelte";
  import Work from "../components/landing/Work.svelte";

  import { services } from "$lib/data/services";
</script>

<Hero />
<Features />

<section class="px-4 py-12 max-w-7xl mx-auto :bg-white/50">
  <div class="grid grid-cols-1 gap-6 md:gap-14">
    {#each services as service}
      <ServiceCard
        image={service.image}
        title={service.title}
        description={service.description}
        route={service.title === "Eco Leasing / Sales"
          ? "/ecoLeasing"
          : "/services"}
      />
    {/each}
  </div>
  <Work />
</section>
