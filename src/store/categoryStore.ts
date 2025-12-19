// store/categoryStore.ts
import { supabase } from "@/supabase-client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type CategoryStore = {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  fetched: boolean;
  fetchCategories: () => Promise<void>;
  refreshCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      loading: false,
      error: null,
      fetched: false,

      fetchCategories: async () => {
        if (get().fetched) return;

        set({ loading: true });

        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .neq("name", "Cash")
          .order("name");

        if (error) {
          console.error("Category fetch error:", error);
          set({ loading: false });
          set({ error: error });
          return;
        }

        set({
          categories: data ?? [],
          fetched: true,
          loading: false,
        });
      },

      refreshCategories: async () => {
        set({ loading: true, fetched: false });
        await get().fetchCategories();
      },
    }),
    {
      name: "xhero-category-store",
    }
  )
);
