import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface IState {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useNavigationStore = create<IState>()(
  devtools((set) => ({
    isSidebarCollapsed: false,

    setSidebarCollapsed: (collapsed: boolean) => {
      set({ isSidebarCollapsed: collapsed });
    },

    toggleSidebar: () => {
      set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
    },
  })),
);
