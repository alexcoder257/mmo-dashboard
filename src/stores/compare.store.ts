import { StaticImageData } from 'next/image';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { ErrorCompare } from '@/models/enums/compare.enum';
import { ICustomAttribute } from '@/models/interfaces/product.interface';

export interface CompareProduct {
  attributeSetId: number;
  customAttributes?: ICustomAttribute[];
  id: string;
  img: StaticImageData | string;
  properties: Record<string, string>;
  title: string;
}

interface CompareActions {
  addProduct: (product: {
    attributeSetId: number;
    customAttributes?: ICustomAttribute[];
    id: number;
    img: StaticImageData | string;
    properties: Record<string, string>;
    title: string;
  }) => {
    error?: ErrorCompare;
    success: boolean;
  };
  askAI: () => void;
  clearProducts: () => void;
  openCompare: () => void;
  removeProduct: (id: string) => void;
  setAIInsights: (insights: null | string) => void;
  setAIModalOpen: (open: boolean) => void;
  showResult: () => void;
}

interface CompareState {
  aiInsights: null | string;
  isAIModalOpen: boolean;
  products: CompareProduct[];
}

interface CompareStore extends CompareActions, CompareState {}

export const useCompareStore = create<CompareStore>()(
  devtools((set, get) => ({
    addProduct: (product) => {
      let result = {
        error: undefined as ErrorCompare | undefined,
        success: false,
      };

      set((state) => {
        const productId = String(product.id);

        if (state.products.find((p) => p.id === productId)) {
          result = { error: ErrorCompare.Duplicate, success: false };
          return state;
        }

        if (state.products.length >= 4) {
          result = { error: ErrorCompare.MaxProducts, success: false };
          return state;
        }

        if (state.products.length > 0) {
          const existingAttributeSetId = state.products[0].attributeSetId;
          if (existingAttributeSetId !== product.attributeSetId) {
            result = {
              error: ErrorCompare.DifferentAttributeSet,
              success: false,
            };
            return state;
          }
        }

        result = { error: undefined, success: true };
        return {
          products: [
            ...state.products,
            {
              attributeSetId: product.attributeSetId,
              customAttributes: product.customAttributes,
              id: productId,
              img: product.img,
              properties: product.properties,
              title: product.title,
            },
          ],
        };
      });

      return result;
    },

    aiInsights: null,

    askAI: async () => {
      const state = get();
      if (state.products.length < 2) {
        return;
      }

      set({ aiInsights: null, isAIModalOpen: true });

      // Simulate AI analysis (in production, this would call an AI API)
      setTimeout(() => {
        const products = get().products;
        const productNames = products.map((p) => p.title).join(', ');

        // Generate mock AI insights based on products
        const insights = `Based on my analysis of ${productNames}:

**Key Differences:**
- Product specifications vary in performance and features
- Price-to-performance ratio differs significantly
- Target user segments are distinct

**Recommendations:**
${products
  .map(
    (p, index) =>
      `- ${p.title}: Best for ${index === 0 ? 'budget-conscious users' : index === 1 ? 'performance enthusiasts' : 'professional workflows'}`,
  )
  .join('\n')}

**Overall Winner:**
The best choice depends on your specific needs and budget. Consider your primary use cases when making the final decision.`;

        set({ aiInsights: insights });
      }, 1500);
    },

    clearProducts: () => {
      set({ aiInsights: null, products: [] });
    },

    isAIModalOpen: false,

    openCompare: () => {
      // This will be handled by the modal system
    },

    products: [],

    removeProduct: (id) => {
      set((state) => ({
        products: state.products.filter((p) => p.id !== String(id)),
      }));
    },

    setAIInsights: (insights) => {
      set({ aiInsights: insights });
    },

    setAIModalOpen: (open) => {
      set({ isAIModalOpen: open });
    },

    showResult: () => {
      // Navigation will be handled by the Link component in CompareDrawer
    },
  })),
);
