<script lang="ts">
    export const prerender = false;
  import ClientSignupForm from "../../components/ui/ClientSignupForm.svelte";
  import { onMount } from "svelte";

  let referral = "";

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");

    if (ref) {
      referral = ref;
    }
  });
</script>

<section>
  <ClientSignupForm {referral} />
</section>
