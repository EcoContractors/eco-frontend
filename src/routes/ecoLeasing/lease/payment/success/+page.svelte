<script lang="ts">
  import { page } from "$app/stores";

  $: bookingId = $page.url.searchParams.get("bookingId");
  $: status = $page.url.searchParams.get("status");
</script>

<section class="min-h-screen bg-tertiary mt-14 flex items-center justify-center px-4">
  <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
    <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
      <svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Payment Successful</h1>
    <p class="text-gray-500 mb-6 leading-relaxed">
      Thank you. Your {status === 'paid' ? 'full' : 'partial'} payment has been received. You will receive a confirmation email shortly.
    </p>
    {#if bookingId}
      <p class="text-sm text-gray-600 mb-6">Booking reference: {bookingId}</p>
    {/if}
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="/ecoLeasing"
        class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
      >
        Browse Equipment
      </a>
      <a
        href="/"
        class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
      >
        Back to Home
      </a>
    </div>
  </div>
</section>
