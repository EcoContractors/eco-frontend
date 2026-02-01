<script lang="ts">
  // Guest booking flow — no login required. Collects contact info + preferred date
  // and creates an Appointment record the admin can confirm from the dashboard.
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { equipmentApi, appointmentApi } from "$lib/api/client";
  import type { Equipment } from "$lib/types";

  let equipment: Equipment | null = null;
  let loading = true;
  let error: string | null = null;

  // Form state
  let submitting = false;
  let submitted = false;
  let formError: string | null = null;
  let formData = {
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    scheduledDate: "",
    notes: "",
  };

  onMount(async () => {
    await loadEquipment();
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

  $: mode = $page.url.searchParams.get("mode") ?? "all";
  $: todayStr = new Date().toISOString().split("T")[0];

  function goBack() {
    goto(`/ecoLeasing/${$page.params.slug}?mode=${mode}`);
  }

  async function handleSubmit() {
    if (!equipment) return;
    submitting = true;
    formError = null;

    try {
      await appointmentApi.book({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        equipmentId: equipment.id,
        scheduledDate: new Date(formData.scheduledDate).toISOString(),
        notes: formData.notes || undefined,
      });
      submitted = true;
    } catch (err) {
      formError = err instanceof Error ? err.message : "Failed to book inspection";
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
  {:else if submitted}
    <!-- SUCCESS STATE -->
    <div class="flex items-center justify-center min-h-[70vh] px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
        <p class="text-gray-500 mb-8 leading-relaxed">
          Your inspection appointment has been submitted successfully.
          You will receive a confirmation email with the scheduled time.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            on:click={goBack}
            class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
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
    <!-- BOOKING FORM -->
    <div class="max-w-4xl mx-auto px-4 py-8">
      <!-- Back button -->
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
            {#if equipment.media && equipment.media.length > 0}
              <img
                src={equipment.media[0].url}
                alt={equipment.name}
                class="w-full h-48 object-cover rounded-xl mb-4"
              />
            {:else}
              <div class="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
            {/if}

            <h2 class="text-lg font-semibold text-gray-900 mb-1">{equipment.name}</h2>

            {#if equipment.manufacturer || equipment.model}
              <p class="text-sm text-gray-500 mb-3">
                {equipment.manufacturer || ""} {equipment.model || ""}
              </p>
            {/if}

            {#if equipment.price}
              <div class="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 mb-3">
                <p class="text-xs text-gray-400 uppercase mb-0.5">Price</p>
                <p class="text-xl font-bold text-primary">{formatCurrency(Number(equipment.price))}</p>
              </div>
            {/if}

            <div class="flex flex-wrap gap-2 text-xs">
              {#if equipment.condition}
                <span class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full capitalize">{equipment.condition}</span>
              {/if}
              {#if equipment.capacity}
                <span class="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{equipment.capacity}</span>
              {/if}
              {#if equipment.isAvailable}
                <span class="bg-green-50 text-green-600 px-2.5 py-1 rounded-full">Available</span>
              {/if}
            </div>
          </div>
        </div>

        <!-- RIGHT: Booking Form -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Book an Inspection</h1>
            <p class="text-gray-500 text-sm mb-6">
              Fill in your details below and we'll schedule an inspection for this equipment.
            </p>

            {#if formError}
              <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {formError}
              </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-5">
              <div>
                <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  bind:value={formData.customerName}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label for="customerPhone" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span class="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  bind:value={formData.customerPhone}
                  required
                  minlength="7"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="e.g. 08012345678"
                />
              </div>

              <div>
                <label for="customerEmail" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span class="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  bind:value={formData.customerEmail}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label for="scheduledDate" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Preferred Inspection Date <span class="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  bind:value={formData.scheduledDate}
                  required
                  min={todayStr}
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                />
              </div>

              <div>
                <label for="notes" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Additional Notes <span class="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="notes"
                  bind:value={formData.notes}
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                  placeholder="Any specific requirements or questions..."
                ></textarea>
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
                  Book Inspection
                {/if}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
