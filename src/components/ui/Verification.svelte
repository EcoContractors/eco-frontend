<script lang="ts">
  import SidebarHeader from "../../components/sidebar/SidebarHeader.svelte";
  import Button from "../ui/Button.svelte";
  import {goto} from "$app/navigation"

  export let onClose: (() => void) | undefined;

  let code = ["", "", "", ""];

  function handleInput(e: Event, index: number) {
    const input = e.target as HTMLInputElement;
    code[index] = input.value.slice(-1);

   
    if (input.value && index < 3) {
      const next = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
      next?.focus();
    }
  }

  function handleVerify() {
    goto("/dashboard")
  }
</script>

<section class="p-8 max-w-7xl mx-auto mt-14">
 
  <SidebarHeader {onClose} />

  <div class="mt-10 w-full md:w-lg lg:w-xl mx-auto rounded-2xl bg-white shadow-xl p-8 text-center space-y-6"
  >
    <div class="space-y-6">
      <h1 class="text-3xl font-semibold text-gray-900">
        Verify Code
      </h1>

      <p class="text-xs text-gray-400 mt-2">
        We sent a code to
        <span class="font-medium text-primary">
          tutimemorah@gmail.com
        </span>
        <br />
        Enter the code below to continue
      </p>
    </div>

    <div class="flex justify-center gap-3 mt-6">
      {#each code as _, i}
        <input
          id={`code-${i}`}
          type="text"
          maxlength="1"
          class="w-12 h-12 text-center text-lg mt-5 font-semibold border border-primary rounded-md outline-none focus:ring-2 focus:ring-primary"
          on:input={(e) => handleInput(e, i)}
        />
      {/each}
    </div>

    <p class="text-xs text-gray-400">
      Didn’t receive code?
      <span class="text-primary cursor-pointer font-medium">
        Resend
      </span>
    </p>

    <div class="mt-16 w-44 md:w-52 mx-auto">
      <Button
        label="Verify"
        width="100%"
        onClick={handleVerify}
      />
    </div>

    <p class="text-xs text-gray-400 mt-6 cursor-pointer">
       Back to Sign in
    </p>
  </div>
</section>
