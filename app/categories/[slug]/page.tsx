"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Category, Product } from "@/lib/types";
import ProductGrid from "@/components/products/ProductGrid";

export default function CategoryPage() {
  const { slug } = useParams() as { slug: string };
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((cats: Category[]) => {
        const cat = cats.find((c) => c.slug === slug);
        if (cat) {
          setCategory(cat);
          return fetch(`/api/products?categoryId=${cat.id}`).then((r) => r.json());
        }
        return [];
      })
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-48 bg-cream-200 rounded-2xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-cream-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-brown-500 text-lg">Category not found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="relative h-64 sm:h-80 overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brown-900/70 to-brown-900/10" />
        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <p className="text-amber-400 text-sm font-medium uppercase tracking-widest mb-2">
            Category
          </p>
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            {category.name}
          </h1>
          <p className="text-cream-200 max-w-xl text-sm">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-brown-500 text-sm">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <ProductGrid
          products={products}
          emptyMessage={`No products in ${category.name} yet.`}
        />
      </div>
    </div>
  );
}
