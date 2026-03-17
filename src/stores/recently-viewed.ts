import { create } from 'zustand';

import {
  MAX_RECENTLY_VIEWED,
  RECENTLY_VIEWED_KEY,
} from '@/constants/recently-viewed.const';

import { fetchArticleDetailApi } from '../apis/article.api';
import { productDetailApi } from '../apis/product.api';
import { IArticleItem } from '../models/interfaces/article.interface';
import { IProduct } from '../models/interfaces/product.interface';

interface IState {
  addRecentlyViewed: (
    id: number | string,
    type: ViewedItemType,
  ) => Promise<void>;
  clearRecentlyViewed: () => void;
  initRecentlyViewed: () => Promise<void>;
  isLoading: boolean;
  recentlyViewed: IViewedItem[];
  removeRecentlyViewed: (index: number) => void;
}

interface IViewedItem {
  data: IArticleItem | IProduct | null;
  ref: IViewedItemRef;
}

interface IViewedItemRef {
  id: number | string;
  type: ViewedItemType;
  viewedAt: number;
}

type ViewedItemType = 'article' | 'product';

export const useRecentlyViewedStore = create<IState>((set, get) => {
  const saveToLocalStorage = (refs: IViewedItemRef[]) => {
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(refs));
  };

  const loadFromLocalStorage = (): IViewedItemRef[] => {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as IViewedItemRef[];
    } catch {
      return [];
    }
  };

  return {
    addRecentlyViewed: async (id, type) => {
      const { recentlyViewed } = get();

      const exists = recentlyViewed.find(
        (item) => item.ref.id === id && item.ref.type === type,
      );
      if (exists) return;

      set({ isLoading: true });

      try {
        let data: IArticleItem | IProduct | null = null;

        if (type === 'product') {
          const res = await productDetailApi(id as string);
          data = res.data;
        } else {
          const res = await fetchArticleDetailApi(id as number);
          data = res.data;
        }

        const newRef: IViewedItemRef = {
          id,
          type,
          viewedAt: Date.now(),
        };

        const newItem: IViewedItem = {
          data,
          ref: newRef,
        };

        const filtered = recentlyViewed.filter(
          (item) => !(item.ref.id === id && item.ref.type === type),
        );

        const updated = [newItem, ...filtered].slice(0, MAX_RECENTLY_VIEWED);

        saveToLocalStorage(updated.map((item) => item.ref));

        set({ recentlyViewed: updated });
      } finally {
        set({ isLoading: false });
      }
    },
    clearRecentlyViewed: () => {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
      set({ recentlyViewed: [] });
    },
    initRecentlyViewed: async () => {
      set({ isLoading: true });

      const refs = loadFromLocalStorage();
      if (!refs.length) {
        set({ isLoading: false });
        return;
      }

      const promises = refs.map(async (item) => {
        try {
          if (item.type === 'product') {
            const res = await productDetailApi(item.id as string);
            return { data: res.data, ref: item } as IViewedItem;
          } else {
            const res = await fetchArticleDetailApi(item.id as number);
            return { data: res.data, ref: item } as IViewedItem;
          }
        } catch {
          return { data: null, ref: item } as IViewedItem;
        }
      });

      const items = await Promise.all(promises);

      set({ isLoading: false, recentlyViewed: items });
    },

    isLoading: true,

    recentlyViewed: [],

    removeRecentlyViewed: (index: number) => {
      const { recentlyViewed } = get();
      const updated = [...recentlyViewed];
      updated.splice(index, 1);

      saveToLocalStorage(updated.map((item) => item.ref));

      set({ recentlyViewed: updated });
    },
  };
});
