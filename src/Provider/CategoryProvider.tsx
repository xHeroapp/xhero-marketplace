// components/CategoryProvider.tsx
"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/store/categoryStore";

export default function CategoryProvider() {
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, []);

  return null;
}
