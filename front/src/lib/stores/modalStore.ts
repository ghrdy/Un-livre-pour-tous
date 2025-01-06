import { create } from 'zustand';

interface ModalState {
  showAddChild: boolean;
  showAddBook: boolean;
  setShowAddChild: (show: boolean) => void;
  setShowAddBook: (show: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  showAddChild: false,
  showAddBook: false,
  setShowAddChild: (show) => set({ showAddChild: show }),
  setShowAddBook: (show) => set({ showAddBook: show }),
}));