import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { categoryListApi } from '@/apis/category.api';
import { ICategory } from '@/models/interfaces/category.interface';
import { TCategoryFlatten } from '@/models/types/category.type';
import { flattenCategories } from '@/utils/category.util';

interface IState {
  categories?: TCategoryFlatten[];
  initialize: () => Promise<void>;
  isLoading: boolean;
  setCategories: (categories: ICategory) => void;
  setLoading: (loading: boolean) => void;
}

export const useCategoryStore = create<IState>()(
  devtools((set, get) => ({
    categories: undefined,
    initialize: async () => {
      if (get().categories) return;

      set({ isLoading: true });
      try {
        const response = await categoryListApi({});
        set({
          categories: flattenCategories(response.data.childrenData || []),
        });
      } catch (error) {
        console.error(error);
      } finally {
        set({ isLoading: false });
      }
    },

    isLoading: false,

    setCategories: (categories: TCategoryFlatten[]) => set({ categories }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
  })),
);
