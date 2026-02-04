<script lang="ts">
  import { Phone } from "lucide-svelte";
  import backdrop2 from "$lib/assets/images/backdrop2.jpg";

  let name = "";
  let email = "";
  let message = "";

  function handleSubmit() {
    console.log({ name, email, message });
    name = "";
    email = "";
    message = "";
  }
</script>

<section class="px-4 sm:px-6 md:px-12 pt-20">
  <div class=" mx-auto flex flex-col md:flex-row md:items-start gap-16">

    <!-- Form -->
    <div class="md:w-1/2 w-full">

      <!-- Heading -->
      <h2 class="text-lg md:text-2xl font-bold text-black">
        Need support? <span class="text-primary">send us a message</span>
      </h2>

      <!-- Form Fields -->
      <div class="mt-6 flex flex-col gap-4">

        <input
          type="text"
          placeholder="Name"
          bind:value={name}
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition"
        />

        <input
          type="email"
          placeholder="Email Address"
          bind:value={email}
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition"
        />

        <textarea
          placeholder="Write your message here..."
          bind:value={message}
          rows={5}
          class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition resize-none"
        ></textarea>

        <button
          on:click={handleSubmit}
          class="w-1/3 py-3 rounded-lg bg-primary text-white text-sm font-semibold hover:opacity-90 transition"
        >
          Send
        </button>
      </div>

      <!-- Contact Us Section -->
      <div class="mt-10 flex flex-col items-center gap-3">
        <p class="text-sm text-gray-500">Need assistance? Speak to us</p>
        <button class="flex items-center gap-2 px-6 py-3 rounded-full border border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-white transition">
          <Phone size={16} />
          Contact Us
        </button>
      </div>

    </div>

    <!-- Image -->
    <div class="md:w-1/2 shrink-0">
      <img
        src={backdrop2}
        alt="Support"
        class="w-full  object-cover"
      />
    </div>

  </div>
</section>