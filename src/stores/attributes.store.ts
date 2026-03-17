import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { productAttributeOptionsApi } from '@/apis/product.api';
import { TOptions } from '@/models/types/shared.type';

interface AttributesState {
  clearOptionsMap: () => void;
  initialize: (attributeCodes: string[]) => Promise<void>;
  isLoading: boolean;
  optionsMap: Record<string, TOptions[]>;
  setOptionsMap: (options: Record<string, TOptions[]>) => void;
}

export const useAttributesStore = create<AttributesState>()(
  devtools((set, get) => ({
    clearOptionsMap: () => set({ optionsMap: {} }),

    initialize: async (attributeCodes: string[]) => {
      const { optionsMap } = get();

      const missingAttributeCodes = attributeCodes.filter(
        (code) => !optionsMap[code],
      );

      if (missingAttributeCodes.length === 0) return;

      set({ isLoading: true });

      try {
        const responses = await Promise.all(
          missingAttributeCodes.map((code) => productAttributeOptionsApi(code)),
        );

        const newOptionsMap = responses.reduce(
          (acc, response, index) => {
            const attributeCode = missingAttributeCodes[index];
            const options = response.data.options;

            if (attributeCode && options) {
              const filteredOptions = options.filter(
                (option) =>
                  option.label?.trim() !== '' &&
                  option.value?.toString().trim() !== '',
              );
              acc[attributeCode] = filteredOptions;
            }

            return acc;
          },
          {} as Record<string, TOptions[]>,
        );

        set({ optionsMap: { ...get().optionsMap, ...newOptionsMap } });
      } catch (error) {
        console.error('Failed to initialize attributes:', error);
      } finally {
        set({ isLoading: false });
      }
    },

    isLoading: false,

    optionsMap: {},
    setOptionsMap: (options) => set({ optionsMap: options }),
  })),
);
