<script lang="ts">
  import EcoLeasing from "../../components/ecoLeasing/EcoLeasing.svelte";
  import { onMount } from "svelte";

  let agentRef: string | null = null;

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    agentRef = params.get("ref");

    if (agentRef) {
      localStorage.setItem("agentRef", agentRef);
    }
  });
</script>

<section>
  <EcoLeasing {agentRef} />
</section>
