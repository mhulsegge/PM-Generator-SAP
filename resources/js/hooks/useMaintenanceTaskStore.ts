import { create } from 'zustand';
import { MaintenanceTask } from '@/types/maintenance';

interface MaintenanceTaskState {
    currentTask: MaintenanceTask | null;
    currentStep: number;
    isLoading: boolean;

    // Actions
    setTask: (task: MaintenanceTask) => void;
    updateTask: (updates: Partial<MaintenanceTask>) => void;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    reset: () => void;
    setLoading: (loading: boolean) => void;
}

const initialTask: MaintenanceTask = {
    name: '',
    status: 'draft',
    is_sap_ready: false,
    items: [],
};

export const useMaintenanceTaskStore = create<MaintenanceTaskState>((set) => ({
    currentTask: null,
    currentStep: 1,
    isLoading: false,

    setTask: (task) => set({ currentTask: task }),

    updateTask: (updates) => set((state) => ({
        currentTask: state.currentTask ? { ...state.currentTask, ...updates } : null
    })),

    setStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

    reset: () => set({ currentTask: null, currentStep: 1 }),

    setLoading: (loading) => set({ isLoading: loading }),
}));
