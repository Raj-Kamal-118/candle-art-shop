"use client";

import { createContext, useContext } from "react";
import { Category, Product } from "@/lib/types";

type CategoryContextType = {
  category: Category | null;
  products: Product[];
};

const CategoryContext = createContext<CategoryContextType>({
  category: null,
  products: [],
});

export function CategoryProvider({
  children,
  category,
  products,
}: {
  children: React.ReactNode;
  category: Category | null;
  products: Product[];
}) {
  return (
    <CategoryContext.Provider value={{ category, products }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryData() {
  return useContext(CategoryContext);
}
