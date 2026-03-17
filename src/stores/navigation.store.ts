import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export enum ACTIVE_TAB_KEY {
  Ai = 'Ai',
  Category = 'Category',
  Home = 'Home',
  Missions = 'Missions',
  News = 'News',
}

interface NavigationActions {
  clearActiveTab: () => void;
  setActiveTab: (tab: ACTIVE_TAB_KEY | null) => void;
}

interface NavigationState {
  activeTab: ACTIVE_TAB_KEY | null;
}

interface NavigationStore extends NavigationActions, NavigationState {}

export const useNavigationStore = create<NavigationStore>()(
  devtools((set) => ({
    activeTab: null,

    clearActiveTab: () => {
      set({ activeTab: null });
    },

    setActiveTab: (tab: ACTIVE_TAB_KEY | null) => {
      set({ activeTab: tab });
    },
  })),
);
