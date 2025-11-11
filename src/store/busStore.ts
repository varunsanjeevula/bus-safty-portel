import { create } from 'zustand';

interface BusState {
  currentBusId: string | null;
  setCurrentBusId: (busId: string) => void;
  clearCurrentBusId: () => void;
}

export const useBusStore = create<BusState>((set) => ({
  currentBusId: null,
  setCurrentBusId: (busId) => set({ currentBusId: busId }),
  clearCurrentBusId: () => set({ currentBusId: null }),
}));
