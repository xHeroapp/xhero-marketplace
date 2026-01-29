import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { persist } from "zustand/middleware";

// Extend Supabase User or define a compatible type that includes our custom fields
// In this app, 'employees' table data is often treated as the 'User' object in state.
// We'll define an intersection type to allow both standard User props and our custom ones.
export type AppUser = User & {
  full_name?: string;
  delivery_address?: string;
  [key: string]: any; // Allow for other dynamic fields from the database
};

type AuthState = {
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),
    }),
    { name: "xhero-marketplace-user-storage" }
  )
);
