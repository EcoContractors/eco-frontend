<script lang="ts">
  import { page } from "$app/stores";

  $: reason = $page.url.searchParams.get("reason") || "unknown";
</script>

<section class="min-h-screen bg-tertiary mt-14 flex items-center justify-center px-4">
  <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
    <div class="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
      <svg class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    </div>
    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
    <p class="text-gray-500 mb-6 leading-relaxed">
      We couldn't complete your payment. Please try again or contact support if the problem persists.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <a
        href="/ecoLeasing"
        class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
      >
        Back to Equipment
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
