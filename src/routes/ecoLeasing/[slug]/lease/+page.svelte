<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { equipmentApi, leaseApi } from "$lib/api/client";
  import type { Equipment } from "$lib/types";
  import type { NatureOfJobOption } from "$lib/types";

  let equipment: Equipment | null = null;
  let natureOptions: NatureOfJobOption[] = [];
  let loading = true;
  let error: string | null = null;
  let submitting = false;
  let submitted = false;
  let formError: string | null = null;
  let submitResult: {
    requiresAdminQuote: boolean;
    totalAmount?: number;
    lowbedAmount?: number;
    leaseAmount?: number;
    paymentUrl?: string;
    quoteNumber?: string;
    bookingNumber?: string;
    message: string;
  } | null = null;

  let formData = {
    companyName: "",
    repName: "",
    email: "",
    phone: "",
    natureOfJob: "",
    startDate: "",
    endDate: "",
    location: "",
  };

  onMount(async () => {
    await Promise.all([loadEquipment(), loadNatureOptions()]);
  });

  async function loadEquipment() {
    loading = true;
    error = null;
    try {
      const data = await equipmentApi.getBySlug($page.params.slug);
      equipment = data.equipment;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load equipment";
    } finally {
      loading = false;
    }
  }

  async function loadNatureOptions() {
    try {
      const data = await leaseApi.getNatureOptions();
      natureOptions = data.options;
    } catch {
      natureOptions = [];
    }
  }

  $: mode = $page.url.searchParams.get("mode") ?? "lease";
  $: agentRef = $page.url.searchParams.get("ref") ?? null;
  $: todayStr = new Date().toISOString().split("T")[0];

  function goBack() {
    goto(`/ecoLeasing/${$page.params.slug}?mode=${mode}${agentRef ? `&ref=${agentRef}` : ""}`);
  }

  async function handleSubmit() {
    if (!equipment) return;
    submitting = true;
    formError = null;

    try {
      const result = await leaseApi.submitForm({
        companyName: formData.companyName,
        repName: formData.repName,
        email: formData.email,
        phone: formData.phone,
        natureOfJob: formData.natureOfJob,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        location: formData.location,
        equipmentId: equipment.id,
        referralCode: agentRef || undefined,
      });
      submitResult = {
        requiresAdminQuote: result.requiresAdminQuote,
        totalAmount: result.totalAmount,
        lowbedAmount: result.lowbedAmount,
        leaseAmount: result.leaseAmount,
        paymentUrl: result.paymentUrl,
        quoteNumber: result.quoteNumber,
        bookingNumber: result.bookingNumber,
        message: result.message,
      };
      submitted = true;
    } catch (err) {
      formError = err instanceof Error ? err.message : "Failed to submit lease request";
    } finally {
      submitting = false;
    }
  }

  function formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
</script>

<section class="min-h-screen bg-tertiary mt-14">
  {#if loading}
    <div class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  {:else if error}
    <div class="text-center py-20 px-4">
      <p class="text-red-500 mb-4">{error}</p>
      <button on:click={loadEquipment} class="px-4 py-2 bg-primary text-white rounded-md">
        Retry
      </button>
    </div>
  {:else if submitted && submitResult}
    <!-- SUCCESS STATE -->
    <div class="flex items-center justify-center min-h-[70vh] px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
        <p class="text-gray-500 mb-6 leading-relaxed">
          {submitResult.message}
        </p>
        {#if submitResult.quoteNumber}
          <p class="text-sm text-gray-600 mb-2">Quote #: {submitResult.quoteNumber}</p>
        {/if}
        {#if submitResult.bookingNumber}
          <p class="text-sm text-gray-600 mb-4">Booking #: {submitResult.bookingNumber}</p>
        {/if}
        {#if !submitResult.requiresAdminQuote && submitResult.totalAmount != null}
          <div class="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-6 text-left inline-block">
            <p class="text-xs text-gray-500 uppercase mb-1">Total (lease + lowbed)</p>
            <p class="text-xl font-bold text-primary">{formatCurrency(submitResult.totalAmount)}</p>
          </div>
        {/if}
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          {#if !submitResult.requiresAdminQuote && submitResult.paymentUrl}
            <button
              on:click={() => goto(submitResult.paymentUrl!)}
              class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
            >
              Proceed to Payment
            </button>
          {/if}
          <button
            on:click={goBack}
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Back to Equipment
          </button>
          <a
            href="/ecoLeasing"
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Browse More
          </a>
        </div>
      </div>
    </div>
  {:else if equipment}
    <!-- LEASE FORM -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <button
        on:click={goBack}
        class="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to {equipment.name}
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- LEFT: Equipment Summary -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-sm p-5 sticky top-20">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Equipment</h2>
            {#if equipment.media && equipment.media.length > 0}
              <img
                src={equipment.media[0].url}
                alt={equipment.name}
                class="w-full h-48 object-cover rounded-xl mb-4"
              />
            {:else}
              <div class="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                <span class="text-gray-400 text-sm">No image</span>
              </div>
            {/if}
            <h3 class="text-lg font-semibold text-gray-900 mb-1">{equipment.name}</h3>
            {#if equipment.manufacturer || equipment.model}
              <p class="text-sm text-gray-500 mb-3">
                {equipment.manufacturer || ""} {equipment.model || ""}
              </p>
            {/if}
            {#if equipment.price}
              <p class="text-sm text-gray-600">
                <span class="text-gray-500">Listed rate:</span>
                {formatCurrency(Number(equipment.price))} / day
              </p>
            {/if}
            <p class="text-xs text-amber-700 mt-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Note: Lowbed cost is added to the amount to be paid upfront.
            </p>
          </div>
        </div>

        <!-- RIGHT: Lease Form -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Lease Request</h1>
            <p class="text-gray-500 text-sm mb-6">
              Fill in your company and job details. Price is calculated based on duration and nature of job.
            </p>

            {#if formError}
              <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {formError}
              </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-5">
              <div>
                <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Name of Company <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  bind:value={formData.companyName}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Your company name"
                />
              </div>

              <div>
                <label for="repName" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Name of Rep <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="repName"
                  bind:value={formData.repName}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span class="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  bind:value={formData.email}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span class="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  bind:value={formData.phone}
                  required
                  minlength="7"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="e.g. 08012345678"
                />
              </div>

              <div>
                <label for="natureOfJob" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Nature of Job <span class="text-red-400">*</span>
                </label>
                <select
                  id="natureOfJob"
                  bind:value={formData.natureOfJob}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                >
                  <option value="">Select nature of job</option>
                  {#each natureOptions as opt}
                    <option value={opt.id}>{opt.label}</option>
                  {/each}
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Start Date <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    bind:value={formData.startDate}
                    required
                    min={todayStr}
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
                <div>
                  <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1.5">
                    End Date <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    bind:value={formData.endDate}
                    required
                    min={formData.startDate || todayStr}
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>
              </div>

              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Location <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  bind:value={formData.location}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Job site or delivery address"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                class="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {#if submitting}
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Submitting...
                {:else}
                  Submit Lease Request
                {/if}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
