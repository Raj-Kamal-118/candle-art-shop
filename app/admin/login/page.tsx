"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ArtisanLogo from "@/components/ui/ArtisanLogo";

const schema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const json = await res.json();
        setError(json.error || "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cream-50)] dark:bg-[#0a0a16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blurs matching brand design system */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-coral-200/30 dark:bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-100/50 dark:bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-8 gap-3">
          <ArtisanLogo />
          <div className="text-[11px] tracking-[0.2em] font-semibold text-amber-700 uppercase">
            Atelier Dashboard
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1830] border border-cream-200 dark:border-amber-900/30 rounded-2xl shadow-xl dark:shadow-2xl p-8">
          <h1 className="text-2xl font-serif font-bold text-brown-900 dark:text-amber-100 mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-brown-600 dark:text-amber-100/60 mb-6">
            Sign in to manage your storefront and orders.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex gap-2 items-center">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Username
              </label>
              <input
                {...register("username")}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors placeholder:text-brown-400 dark:placeholder:text-amber-100/30"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[13px] font-medium text-brown-800 dark:text-amber-100/80 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#12101e] border border-brown-300 dark:border-amber-900/40 rounded-lg text-sm text-brown-900 dark:text-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500/50 transition-colors pr-10 placeholder:text-brown-400 dark:placeholder:text-amber-100/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-400 dark:text-amber-100/40 hover:text-brown-600 dark:hover:text-amber-100/80 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-coral-600 text-white rounded-xl font-semibold text-sm hover:bg-coral-700 hover:-translate-y-0.5 shadow-lg shadow-coral-200 dark:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-y-0 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                "Entering atelier..."
              ) : (
                <>
                  Sign In <Sparkles size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
