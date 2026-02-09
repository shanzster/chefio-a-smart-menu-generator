import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],

  addToast: (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  }
}));

// Helper functions for easy usage
export const toast = {
  success: (message, duration) => useToastStore.getState().addToast(message, 'success', duration),
  error: (message, duration) => useToastStore.getState().addToast(message, 'error', duration),
  info: (message, duration) => useToastStore.getState().addToast(message, 'info', duration),
};

export { useToastStore };
export default useToastStore;
