import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  timeout?: number; // milliseconds, default 3000
}

let id = 0;

export const toasts = writable<ToastMessage[]>([]);

export function addToast(message: string, type: ToastType = 'info', timeout: number = 3000) {
  toasts.update(currentToasts => [
    ...currentToasts,
    { id: ++id, message, type, timeout }
  ]);
}

export function removeToast(id: number) {
  toasts.update(currentToasts => currentToasts.filter(toast => toast.id !== id));
}
