"use client";

import { createContext, useContext } from "react";
import { Product, Category } from "@/lib/types";

type ProductContextType = {
  product: Product | null;
  category: Category | null;
  reviews: any[];
};

const ProductContext = createContext<ProductContextType>({
  product: null,
  category: null,
  reviews: [],
});

export function ProductProvider({
  children,
  product,
  category,
  reviews,
}: {
  children: React.ReactNode;
  product: Product | null;
  category: Category | null;
  reviews: any[];
}) {
  return (
    <ProductContext.Provider value={{ product, category, reviews }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProductData() {
  return useContext(ProductContext);
}
