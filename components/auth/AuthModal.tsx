"use client";

import { useState, useMemo } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
  AlertTriangle,
  AlertCircle,
  Info,
  Shield,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { User } from "@/lib/types";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: User) => void;
  title?: string;
}

type AuthMode = "login" | "signup" | "forgot";

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Welcome",
}: AuthModalProps) {
  const { setCurrentUser } = useStore();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  if (!isOpen) return null;

  const passwordStrength = useMemo(() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 1)
      return {
        score: 1,
        label: "Weak",
        icon: <AlertCircle size={14} className="text-red-500" />,
        color: "bg-red-400",
      };
    if (score === 2)
      return {
        score: 2,
        label: "Fair",
        icon: <Info size={14} className="text-orange-500" />,
        color: "bg-orange-400",
      };
    if (score === 3)
      return {
        score: 3,
        label: "Good",
        icon: <Shield size={14} className="text-yellow-500" />,
        color: "bg-yellow-400",
      };
    if (score === 4)
      return {
        score: 4,
        label: "Strong",
        icon: <ShieldCheck size={14} className="text-green-500" />,
        color: "bg-green-400",
      };
    return {
      score: 5,
      label: "Super Strong",
      icon: <CheckCircle size={14} className="text-green-600" />,
      color: "bg-green-600",
    };
  }, [password]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.user) {
          setMessage("Account created successfully! You can now log in.");
          setMode("login");
        }
      } else if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user) {
          const userObj: User = {
            id: data.user.id,
            email: data.user.email || undefined,
            name: data.user.user_metadata?.full_name || undefined,
            phone: data.user.phone || "",
            createdAt: data.user.created_at,
            updatedAt: data.user.updated_at || data.user.created_at,
          };
          setCurrentUser(userObj);
          onSuccess?.(userObj);
          onClose();
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage("Password reset link sent to your email address!");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white dark:bg-[#1a1830] rounded-2xl shadow-2xl w-full max-w-md p-6 dark:border dark:border-amber-900/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-amber-300 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="font-serif text-2xl font-bold text-brown-900 dark:text-amber-100">
            {mode === "forgot" ? "Reset Password" : title}
          </h2>
          <p className="text-sm text-brown-500 dark:text-amber-100/60 mt-1">
            {mode === "forgot"
              ? "Enter your email to receive a reset link"
              : "Log in or create an account to track orders."}
          </p>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        {mode !== "forgot" && (
          <>
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-200 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="flex items-center gap-2 mb-4">
              <hr className="flex-1 border-gray-200 dark:border-gray-700" />
              <span className="text-xs text-gray-400">OR</span>
              <hr className="flex-1 border-gray-200 dark:border-gray-700" />
            </div>
          </>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1">
              <div className="relative">
                <UserIcon
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100"
                />
              </div>
              {name && (
                <p className="text-xs text-amber-600 dark:text-amber-400 pl-1 animate-pulse">
                  Nice to meet you, {name.split(" ")[0]}! ✨
                </p>
              )}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full pl-10 pr-4 py-3 text-sm border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100"
            />
          </div>

          {mode !== "forgot" && (
            <div className="space-y-2">
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.getModifierState) {
                      setCapsLockOn(e.getModifierState("CapsLock"));
                    }
                  }}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-12 py-3 text-sm border border-brown-300 dark:border-amber-900/50 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-400 dark:text-amber-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-amber-300 transition-colors select-none"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {capsLockOn && (
                <p className="text-xs font-medium text-amber-600 dark:text-amber-500 pl-1 mt-1 flex items-center gap-1">
                  <AlertTriangle size={14} /> Warning: Caps lock is ON
                </p>
              )}
              {mode === "signup" && passwordStrength && (
                <div className="pl-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      Password strength:{" "}
                      <span className="text-gray-800 dark:text-gray-200">
                        {passwordStrength.label}
                      </span>
                      {passwordStrength.icon}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                          passwordStrength.score >= level
                            ? passwordStrength.color
                            : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            {mode === "login"
              ? "Sign In"
              : mode === "signup"
                ? "Create Account"
                : "Send Reset Link"}
          </Button>
        </form>

        <div className="mt-4 text-center space-y-2">
          {mode === "login" && (
            <button
              onClick={() => setMode("forgot")}
              className="text-sm text-amber-700 dark:text-amber-400 hover:underline block w-full"
            >
              Forgot your password?
            </button>
          )}
          {mode !== "forgot" ? (
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-brown-600 dark:text-gray-300 block w-full mt-2"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Log in"}
            </button>
          ) : (
            <button
              onClick={() => setMode("login")}
              className="text-sm flex items-center justify-center gap-1 text-amber-700 dark:text-amber-400 hover:underline block w-full mt-2"
            >
              <ArrowLeft size={14} /> Back to Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
