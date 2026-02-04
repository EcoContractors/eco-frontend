<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { leaseApi } from "$lib/api/client";
  import { env } from "$env/dynamic/public";
  import type { LeaseBooking } from "$lib/types";

  let booking: LeaseBooking | null = null;
  let error: string | null = null;
  let paymentStatus: "idle" | "processing" | "success" | "failed" | "cancelled" = "idle";
  let verifyError: string | null = null;
  let paystackLoaded = false;

  onMount(() => {
    // Parse booking data from URL params
    const bookingParam = $page.url.searchParams.get("booking");
    if (bookingParam) {
      try {
        booking = JSON.parse(decodeURIComponent(bookingParam));
      } catch {
        error = "Invalid booking data";
      }
    } else {
      error = "No booking data found. Please go back and fill in the rental form.";
    }

    // Load Paystack inline script
    if (!document.getElementById("paystack-script")) {
      const script = document.createElement("script");
      script.id = "paystack-script";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.onload = () => { paystackLoaded = true; };
      script.onerror = () => { error = "Failed to load payment provider"; };
      document.head.appendChild(script);
    } else {
      paystackLoaded = true;
    }
  });

  $: mode = $page.url.searchParams.get("mode") ?? "all";

  function formatCurrency(amount: number | undefined): string {
    if (!amount && amount !== 0) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function handlePayNow() {
    if (!booking || !paystackLoaded) return;

    const paystackKey = env.PUBLIC_PAYSTACK_KEY;
    if (!paystackKey) {
      verifyError = "Payment configuration error. Please contact support.";
      return;
    }

    paymentStatus = "processing";
    verifyError = null;

    // @ts-ignore - PaystackPop is loaded via external script
    const handler = PaystackPop.setup({
      key: paystackKey,
      email: booking.contactEmail,
      amount: booking.totalAmount * 100, // Paystack expects amount in kobo
      currency: "NGN",
      ref: booking.bookingNumber,
      metadata: {
        bookingNumber: booking.bookingNumber,
        equipmentName: booking.equipment.name,
        custom_fields: [
          {
            display_name: "Booking Number",
            variable_name: "booking_number",
            value: booking.bookingNumber,
          },
        ],
      },
      callback: async (response: { reference: string }) => {
        // Payment successful - verify with backend
        paymentStatus = "processing";
        try {
          const result = await leaseApi.verify({
            reference: booking!.bookingNumber,
            paystackReference: response.reference,
          });

          if (result.success) {
            booking = result.booking;
            paymentStatus = "success";
          } else {
            verifyError = result.message || "Payment verification failed";
            paymentStatus = "failed";
          }
        } catch (err) {
          verifyError = err instanceof Error ? err.message : "Failed to verify payment";
          paymentStatus = "failed";
        }
      },
      onClose: () => {
        if (paymentStatus === "processing") {
          paymentStatus = "cancelled";
        }
      },
    });

    handler.openIframe();
  }

  function goBackToForm() {
    goto(`/ecoLeasing/${$page.params.slug}/rent?mode=${mode}`);
  }

  function goToEquipment() {
    goto(`/ecoLeasing/${$page.params.slug}?mode=${mode}`);
  }

  function browsMore() {
    goto("/ecoLeasing");
  }
</script>

<section class="min-h-screen bg-tertiary mt-14">
  {#if error}
    <div class="flex items-center justify-center min-h-[70vh] px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <p class="text-red-500 mb-4">{error}</p>
        <button
          on:click={goBackToForm}
          class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  {:else if paymentStatus === "success" && booking}
    <!-- SUCCESS STATE -->
    <div class="flex items-center justify-center min-h-[70vh] px-4">
      <div class="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-lg w-full text-center">
        <div class="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h2>
        <p class="text-gray-500 mb-2 leading-relaxed">
          Your equipment rental has been confirmed.
        </p>
        <p class="text-sm text-gray-400 mb-6">
          Booking Number: <span class="font-semibold text-gray-700">{booking.bookingNumber}</span>
        </p>

        <div class="bg-gray-50 rounded-xl p-4 mb-6 text-left text-sm space-y-2">
          <div class="flex justify-between">
            <span class="text-gray-500">Equipment</span>
            <span class="font-medium text-gray-800">{booking.equipment.name}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500">Period</span>
            <span class="font-medium text-gray-800">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-2">
            <span class="text-gray-500">Amount Paid</span>
            <span class="font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
          </div>
        </div>

        <p class="text-sm text-gray-500 mb-8">
          A confirmation email has been sent to <span class="font-medium">{booking.contactEmail}</span>
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            on:click={goToEquipment}
            class="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow hover:opacity-90 transition"
          >
            Back to Equipment
          </button>
          <button
            on:click={browsMore}
            class="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Browse More
          </button>
        </div>
      </div>
    </div>
  {:else if booking}
    <!-- PAYMENT PAGE -->
    <div class="max-w-2xl mx-auto px-4 py-8">
      <!-- Back button -->
      <button
        on:click={goBackToForm}
        class="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition"
      >
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Rental Form
      </button>

      <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Complete Payment</h1>
        <p class="text-gray-500 text-sm mb-6">Review your booking and proceed to payment.</p>

        <!-- Booking Summary -->
        <div class="bg-gray-50 rounded-xl p-5 mb-6 space-y-3">
          <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Booking Summary</h3>

          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Equipment</span>
            <span class="font-medium text-gray-800">{booking.equipment.name}</span>
          </div>
          {#if booking.equipment.model}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Model</span>
              <span class="font-medium text-gray-800">{booking.equipment.model}</span>
            </div>
          {/if}
          {#if booking.companyName}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Company</span>
              <span class="font-medium text-gray-800">{booking.companyName}</span>
            </div>
          {/if}
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Start Date</span>
            <span class="font-medium text-gray-800">{formatDate(booking.startDate)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">End Date</span>
            <span class="font-medium text-gray-800">{formatDate(booking.endDate)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Duration</span>
            <span class="font-medium text-gray-800">{booking.durationDays} day{booking.durationDays > 1 ? 's' : ''}</span>
          </div>
          {#if booking.location}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Location</span>
              <span class="font-medium text-gray-800">{booking.location}</span>
            </div>
          {/if}
          {#if booking.jobScope}
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Job Scope</span>
              <span class="font-medium text-gray-800">{booking.jobScope}</span>
            </div>
          {/if}

          <div class="border-t border-gray-200 pt-3 mt-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Daily Rate</span>
              <span class="text-gray-700">{formatCurrency(booking.equipment.dailyRate)}</span>
            </div>
            <div class="flex justify-between text-base font-bold mt-2">
              <span class="text-gray-900">Total Amount</span>
              <span class="text-primary">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>
        </div>

        <!-- Payment Error -->
        {#if verifyError}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {verifyError}
          </div>
        {/if}

        <!-- Cancelled State -->
        {#if paymentStatus === "cancelled"}
          <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl text-sm">
            Payment was cancelled. You can try again by clicking the button below.
          </div>
        {/if}

        <!-- Failed State -->
        {#if paymentStatus === "failed"}
          <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            Payment verification failed. Please try again or contact support.
          </div>
        {/if}

        <!-- Pay Now Button -->
        <button
          on:click={handlePayNow}
          disabled={paymentStatus === "processing" || !paystackLoaded}
          class="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {#if paymentStatus === "processing"}
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Processing Payment...
          {:else if !paystackLoaded}
            Loading Payment Provider...
          {:else}
            Pay Now &mdash; {formatCurrency(booking.totalAmount)}
          {/if}
        </button>

        <p class="text-xs text-gray-400 text-center mt-4">
          Secured by Paystack. Your payment information is encrypted.
        </p>
      </div>
    </div>
  {/if}
</section>
