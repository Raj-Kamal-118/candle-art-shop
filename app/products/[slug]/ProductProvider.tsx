"use client";

import { createContext, useContext } from "react";
import { Product, Category } from "@/lib/types";

type ProductContextType = {
  product: Product | null;
  category: Category | null;
};

const ProductContext = createContext<ProductContextType>({
  product: null,
  category: null,
});

export function ProductProvider({
  children,
  product,
  category,
}: {
  children: React.ReactNode;
  product: Product | null;
  category: Category | null;
}) {
  return (
    <ProductContext.Provider value={{ product, category }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductData() {
  return useContext(ProductContext);
}
