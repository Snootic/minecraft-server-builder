import { create } from "zustand";

export type SnackbarType = "success" | "error" | "info" | "warning";

export interface SnackbarData {
  id: string;
  message: string;
  draggable?: boolean;
  type?: SnackbarType;
  duration?: number;
  action?: { label: string; onClick: () => void };
  className?: string;
  closeable?: boolean;
  progress?: number;
}

export interface SnackbarState {
  snackbars: SnackbarData[];
  add: (snackbar: SnackbarData) => void;
  dismiss: (id: string) => void;
}

export const useSnackbar = create<SnackbarState>((set) => ({
  snackbars: [],
  add: (newSnackbar) =>
    set((state) => {
      const exists = state.snackbars.find((s) => s.id === newSnackbar.id);
      if (exists) {
        return {
          snackbars: state.snackbars.map((s) =>
            s.id === newSnackbar.id ? { ...s, ...newSnackbar } : s,
          ),
        };
      }
      return { snackbars: [...state.snackbars, newSnackbar] };
    }),
  dismiss: (id) =>
    set((state) => ({
      snackbars: state.snackbars.filter((t) => t.id !== id),
    })),
}));
