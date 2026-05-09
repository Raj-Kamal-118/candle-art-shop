"use client";

import { createContext, useContext } from "react";
import { Category, Product } from "@/lib/types";

type CategoryContextType = {
  category: Category | null;
  products: Product[];
  allCategories: Category[];
};

const CategoryContext = createContext<CategoryContextType>({
  category: null,
  products: [],
  allCategories: [],
});

export function CategoryProvider({
  children,
  category,
  products,
  allCategories,
}: {
  children: React.ReactNode;
  category: Category | null;
  products: Product[];
  allCategories: Category[];
}) {
  return (
    <CategoryContext.Provider value={{ category, products, allCategories }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryData() {
  return useContext(CategoryContext);
}
