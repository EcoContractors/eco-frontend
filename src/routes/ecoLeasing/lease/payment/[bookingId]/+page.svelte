<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { leaseApi } from "$lib/api/client";

  let paymentInfo: {
    bookingId: string;
    bookingNumber: string;
    quoteNumber?: string;
    equipment: { id: string; name: string; slug: string };
    totalAmount: number;
    lowbedAmount: number;
    leaseAmount: number;
    paymentStatus: string;
  } | null = null;
  let loading = true;
  let error: string | null = null;
  let initiating: 'full' | 'half' | null = null;

  $: bookingId = $page.params.bookingId;

  onMount(async () => {
    await loadPaymentInfo();
  });

  async function loadPaymentInfo() {
    loading = true;
    error = null;
    try {
      paymentInfo = await leaseApi.getBookingPaymentInfo(bookingId);
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load payment info";
    } finally {
      loading = false;
    }
  }

  async function pay(type: 'full' | 'half') {
    if (!paymentInfo) return;
    initiating = type;
    try {
      const result = await leaseApi.initiatePayment(paymentInfo.bookingId, type);
      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
        return;
      }
      error = "Could not start payment";
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to initiate payment";
    } finally {
      initiating = null;
    }
  }

  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const halfAmount = paymentInfo ? Math.round(paymentInfo.totalAmount / 2) : 0;
</script>

<section class="min-h-screen bg-tertiary mt-14 px-4 py-8">
  {#if loading}
    <div class="flex items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
    </div>
  {:else if error || !paymentInfo}
    <div class="max-w-md mx-auto text-center py-20">
      <p class="text-red-500 mb-4">{error || "Booking not found or not eligible for payment."}</p>
      <a
        href="/ecoLeasing"
        class="inline-block px-6 py-2.5 bg-primary text-white rounded-lg font-medium"
      >
        Back to Equipment
      </a>
    </div>
  {:else}
    <div class="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h1>
      <p class="text-gray-500 text-sm mb-6">
        Choose to pay in full or 50% now. You will be redirected to Paystack to complete payment.
      </p>

      <div class="bg-gray-50 rounded-xl p-4 mb-6">
        <p class="text-sm text-gray-600 mb-1">Equipment</p>
        <p class="font-semibold text-gray-900">{paymentInfo.equipment.name}</p>
        <p class="text-xs text-gray-500 mt-2">Booking #: {paymentInfo.bookingNumber}</p>
      </div>

      <div class="space-y-3 mb-6">
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Lease amount</span>
          <span class="font-medium">{formatCurrency(paymentInfo.leaseAmount)}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600">Lowbed cost</span>
          <span class="font-medium">{formatCurrency(paymentInfo.lowbedAmount)}</span>
        </div>
        <div class="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
          <span>Total</span>
          <span class="text-primary">{formatCurrency(paymentInfo.totalAmount)}</span>
        </div>
      </div>

      {#if error}
        <div class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      {/if}

      <div class="space-y-3">
        <button
          type="button"
          disabled={initiating !== null}
          on:click={() => pay('full')}
          class="w-full py-3.5 bg-primary text-white rounded-xl font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {#if initiating === 'full'}
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            Redirecting...
          {:else}
            Pay Full Amount — {formatCurrency(paymentInfo.totalAmount)}
          {/if}
        </button>
        <button
          type="button"
          disabled={initiating !== null}
          on:click={() => pay('half')}
          class="w-full py-3.5 border-2 border-primary text-primary rounded-xl font-semibold text-sm hover:bg-primary/5 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {#if initiating === 'half'}
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
            Redirecting...
          {:else}
            Pay 50% Now — {formatCurrency(halfAmount)}
          {/if}
        </button>
      </div>

      <p class="text-xs text-gray-500 mt-6 text-center">
        Secure payment powered by Paystack.
      </p>
    </div>
  {/if}
</section>
