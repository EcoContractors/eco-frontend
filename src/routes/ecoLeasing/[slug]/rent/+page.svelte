<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { equipmentApi, leaseApi } from "$lib/api/client";
  import type { Equipment } from "$lib/types";

  let equipment: Equipment | null = null;
  let loading = true;
  let error: string | null = null;

  let submitting = false;
  let formError: string | null = null;

  let formData = {
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    jobScope: "",
    location: "",
    startDate: "",
    endDate: "",
  };

  const jobScopeOptions = [
    "Construction",
    "Mining",
    "Road Work",
    "Excavation",
    "Demolition",
    "Land Clearing",
    "Other",
  ];

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

  // Calculate rental duration and total
  $: durationDays = formData.startDate && formData.endDate
    ? Math.max(Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)), 0)
    : 0;
  $: dailyRate = equipment ? Number(equipment.price) : 0;
  $: totalAmount = dailyRate * durationDays;

  function goBack() {
    goto(`/ecoLeasing/${$page.params.slug}?mode=${mode}`);
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

  async function handleSubmit() {
    if (!equipment) return;
    if (durationDays < 1) {
      formError = "End date must be after start date";
      return;
    }

    submitting = true;
    formError = null;

    try {
      const result = await leaseApi.create({
        equipmentId: equipment.id,
        companyName: formData.companyName,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        jobScope: formData.jobScope,
        location: formData.location,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });

      // Navigate to payment page with booking data
      const bookingData = encodeURIComponent(JSON.stringify(result.booking));
      goto(`/ecoLeasing/${$page.params.slug}/rent/payment?booking=${bookingData}`);
    } catch (err) {
      formError = err instanceof Error ? err.message : "Failed to create booking";
    } finally {
      submitting = false;
    }
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
  {:else if equipment}
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
                <p class="text-xs text-gray-400 uppercase mb-0.5">Daily Rate</p>
                <p class="text-xl font-bold text-primary">{formatCurrency(Number(equipment.price))}<span class="text-sm font-normal text-gray-400">/day</span></p>
              </div>
            {/if}

            <!-- Rental Calculation -->
            {#if durationDays > 0}
              <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{formatCurrency(dailyRate)} x {durationDays} day{durationDays > 1 ? 's' : ''}</span>
                </div>
                <div class="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-200 pt-2 mt-2">
                  <span>Total</span>
                  <span class="text-primary">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            {/if}

            <div class="flex flex-wrap gap-2 text-xs mt-3">
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

        <!-- RIGHT: Rental Form -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">Rent Equipment</h1>
            <p class="text-gray-500 text-sm mb-6">
              Fill in your details below to rent this equipment. You'll proceed to payment after submission.
            </p>

            {#if formError}
              <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                {formError}
              </div>
            {/if}

            <form on:submit|preventDefault={handleSubmit} class="space-y-5">
              <!-- Company Information -->
              <div class="border-b border-gray-100 pb-4 mb-1">
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Company Information</h3>
              </div>

              <div>
                <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Company Name <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  bind:value={formData.companyName}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label for="contactName" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Contact Name <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  bind:value={formData.contactName}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    bind:value={formData.contactEmail}
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label for="contactPhone" class="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span class="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    bind:value={formData.contactPhone}
                    required
                    minlength="7"
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    placeholder="e.g. 08012345678"
                  />
                </div>
              </div>

              <!-- Job Details -->
              <div class="border-b border-gray-100 pb-4 mb-1 mt-6">
                <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide">Job Details</h3>
              </div>

              <div>
                <label for="jobScope" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Scope <span class="text-red-400">*</span>
                </label>
                <select
                  id="jobScope"
                  bind:value={formData.jobScope}
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                >
                  <option value="" disabled>Select job scope</option>
                  {#each jobScopeOptions as option}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
              </div>

              <div>
                <label for="location" class="block text-sm font-medium text-gray-700 mb-1.5">
                  Job Location <span class="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="location"
                  bind:value={formData.location}
                  required
                  minlength="2"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  placeholder="e.g. Lagos, Nigeria"
                />
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

              <button
                type="submit"
                disabled={submitting || durationDays < 1}
                class="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {#if submitting}
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Processing...
                {:else}
                  Proceed to Payment {#if totalAmount > 0}&mdash; {formatCurrency(totalAmount)}{/if}
                {/if}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
</section>
