"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Star,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Product, Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { formatPrice, getVariantPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function ProductDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } =
    useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<Record<string, string>>(
    {},
  );
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        if (data.categoryId) {
          fetch(`/api/categories/${data.categoryId}`)
            .then((r) => r.json())
            .then(setCategory);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, customizations);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const toggleFavorite = () => {
    if (!product) return;
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-cream-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-6 bg-cream-200 rounded w-1/4" />
            <div className="h-8 bg-cream-200 rounded w-3/4" />
            <div className="h-4 bg-cream-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-brown-500 text-lg">Product not found.</p>
        <Button
          onClick={() => router.push("/products")}
          variant="outline"
          className="mt-4"
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const effectivePrice = getVariantPrice(product, customizations);
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null;
  const favorite = isFavorite(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-brown-500 hover:text-amber-700 transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-cream-100 shadow-lg"
          >
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    selectedImage === i
                      ? "border-amber-500 shadow-md"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="lg:py-2">
          {/* Category + badges */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {category && (
              <a
                href={`/categories/${category.slug}`}
                className="text-xs font-medium text-amber-700 uppercase tracking-widest hover:text-amber-800"
              >
                {category.name}
              </a>
            )}
            {product.featured && <Badge>Featured</Badge>}
            {product.customizable && <Badge variant="info">Customizable</Badge>}
            {!product.inStock && <Badge variant="warning">Out of Stock</Badge>}
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brown-900 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Rating placeholder */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < 4
                      ? "text-amber-400 fill-amber-400"
                      : "text-cream-300 fill-cream-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm text-brown-500">4.0 (24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-brown-900">
              {formatPrice(effectivePrice)}
            </span>
            {effectivePrice !== product.price && (
              <span className="text-sm text-brown-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {product.compareAtPrice && effectivePrice === product.price && (
              <>
                <span className="text-lg text-brown-400 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
                <Badge variant="danger">{discount}% OFF</Badge>
              </>
            )}
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="prose dark:prose-invert max-w-none text-brown-600 dark:text-gray-300 leading-relaxed mb-6"
          />

          {/* Customization options */}
          {product.customizable &&
            product.customizationOptions &&
            product.customizationOptions.length > 0 && (
              <div className="mb-6 space-y-4">
                <h3 className="font-semibold text-brown-900 text-sm">
                  Customize Your Order
                </h3>
                {product.customizationOptions.map((opt) => (
                  <div key={opt.label}>
                    <label className="block text-sm font-medium text-brown-700 mb-1.5">
                      {opt.label}
                    </label>
                    {opt.type === "select" && opt.options ? (
                      <select
                        className="w-full px-3 py-2.5 border border-brown-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                        value={customizations[opt.label] || ""}
                        onChange={(e) =>
                          setCustomizations((prev) => ({
                            ...prev,
                            [opt.label]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select {opt.label}</option>
                        {opt.options.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : opt.type === "text" ? (
                      <input
                        type="text"
                        placeholder={`Enter your ${opt.label.toLowerCase()}`}
                        className="w-full px-3 py-2.5 border border-brown-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                        value={customizations[opt.label] || ""}
                        onChange={(e) =>
                          setCustomizations((prev) => ({
                            ...prev,
                            [opt.label]: e.target.value,
                          }))
                        }
                      />
                    ) : (
                      <input
                        type="color"
                        className="w-16 h-10 border border-brown-300 rounded-lg cursor-pointer"
                        value={customizations[opt.label] || "#d97706"}
                        onChange={(e) =>
                          setCustomizations((prev) => ({
                            ...prev,
                            [opt.label]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium text-brown-700">
              Quantity
            </label>
            <div className="flex items-center border border-brown-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-brown-600 hover:bg-cream-100 transition-colors"
              >
                −
              </button>
              <span className="px-4 py-2 text-sm font-medium border-x border-brown-300 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stockCount, quantity + 1))
                }
                className="px-3 py-2 text-brown-600 hover:bg-cream-100 transition-colors"
              >
                +
              </button>
            </div>
            {product.stockCount < 10 && (
              <span className="text-xs text-amber-600 font-medium">
                Only {product.stockCount} in stock
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart size={18} />
              {addedToCart
                ? "Added to Cart!"
                : product.inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
            </Button>
            <button
              onClick={toggleFavorite}
              className={`px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                favorite
                  ? "border-red-400 bg-red-50 text-red-500"
                  : "border-brown-300 text-brown-500 hover:border-red-400 hover:text-red-500"
              }`}
            >
              <Heart size={20} className={favorite ? "fill-current" : ""} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cream-200">
            {[
              { icon: Truck, label: "Free Shipping", sub: "Orders over $100" },
              { icon: Shield, label: "Secure Payment", sub: "100% protected" },
              { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.label}
                  className="flex flex-col items-center text-center gap-1.5"
                >
                  <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center">
                    <Icon size={16} className="text-amber-700" />
                  </div>
                  <p className="text-xs font-semibold text-brown-800">
                    {badge.label}
                  </p>
                  <p className="text-xs text-brown-500">{badge.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-cream-100 text-brown-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
