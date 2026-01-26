<script lang="ts">
  import { toasts, removeToast, type ToastMessage, type ToastType } from './toast';
  import { fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-svelte';

  function getIcon(type: ToastType) {
    switch (type) {
      case 'success':
        return CheckCircle;
      case 'error':
        return XCircle;
      case 'info':
        return Info;
      case 'warning':
        return AlertTriangle;
      default:
        return Info;
    }
  }

  $: toastClassMap = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  function startTimeout(toast: ToastMessage) {
    if (toast.timeout) {
      setTimeout(() => removeToast(toast.id), toast.timeout);
    }
  }

  onMount(() => {
    // Start timeouts for any toasts added before component mount
    toasts.subscribe(currentToasts => {
      currentToasts.forEach(toast => startTimeout(toast));
    })();
  });
</script>

<div class="fixed top-4 right-4 z-[9999] w-full max-w-xs space-y-3">
  {#each $toasts as toast (toast.id)}
    <div
      in:fly={{ y: -50, duration: 200 }}
      out:fly={{ y: -50, duration: 150 }}
      class="flex items-center justify-between p-4 rounded-md shadow-lg text-white {toastClassMap[toast.type]}"
    >
      <div class="flex items-center gap-3">
        <svelte:component this={getIcon(toast.type)} size={20} />
        <span class="text-sm font-medium">{toast.message}</span>
      </div>
      <button on:click={() => removeToast(toast.id)} class="text-white hover:text-gray-100 p-1 rounded-full">
        <X size={16} />
      </button>
    </div>
  {/each}
</div>
