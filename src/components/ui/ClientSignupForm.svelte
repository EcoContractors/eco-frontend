<script lang="ts">
  import Button from "./Button.svelte";
  import { goto } from "$app/navigation";

  let firstName = "";
  let lastName = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let phone = "";

  let showPassword = false;
  let showConfirmPassword = false;
  let loading = false;
  let error = "";

  export let referral = "";
  let referralCode = referral;

  async function handleSubmit() {
    error = "";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone
    ) {
      error = "All fields are required";
      return;
    }

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    loading = true;

    try {
      const res = await fetch("/clientSignupForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          phone,
          referralCode,
          role: "customer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        error = data.message || "Signup failed";
        return;
      }

      // backend says: check email for verification
      goto("/verify");
    } catch (err) {
      error = "Network error. Please try again.";
    } finally {
      loading = false;
    }
  }
</script>

<section class="p-8 max-w-7xl mx-auto mt-14">
  <div class="text-center mt-6 mb-8">
    <h1 class="text-3xl font-semibold text-gray-900">Create Client Account</h1>
    <p class="text-md md:text-xl text-gray-400 mt-4">
      Please provide your personal details
    </p>
  </div>

  <form class="rounded-2xl border border-primary/40 bg-white/40 backdrop-blur-xl shadow-xl p-6 space-y-4 w-full md:w-lg lg:w-xl mx-auto"
    on:submit|preventDefault={handleSubmit}>

    <div class="grid grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="First Name"
        bind:value={firstName}
        class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="text"
        placeholder="Last Name"
        bind:value={lastName}
        class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <input
      type="email"
      placeholder="Email Address"
      bind:value={email}
      class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <input
      type="tel"
      placeholder="Phone Number"
      bind:value={phone}
      class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <div class="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        bind:value={password}
        class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
        on:click={() => (showPassword = !showPassword)}
      >
        👁
      </button>
    </div>

    <div class="relative">
      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <button
        type="button"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
        on:click={() => (showConfirmPassword = !showConfirmPassword)}
      >
        👁
      </button>
    </div>

    <input
      type="text"
      placeholder="Referral Code (optional)"
      bind:value={referralCode}
      class="w-full px-4 py-3 rounded-md bg-white text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    {#if error}
      <p class="text-sm text-red-500 text-center">{error}</p>
    {/if}

    <div class="flex justify-center mt-6">
      <Button
        label={loading ? "Creating account..." : "Create Account"}
        width="220px"
        type="submit"
        
      />
    </div>
  </form>
</section>
