"use client";

import { Flame, Sparkles, Key, Shell, Bookmark, Image, Heart } from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
  Flame, Sparkles, Key, Shell, Bookmark, Image, Heart,
};

interface CatTabProps {
  cat: { id: string; label: string; icon: string; sub: string };
  active: boolean;
  count: number;
  onClick: () => void;
}

export default function CatTab({ cat, active, count, onClick }: CatTabProps) {
  const Icon = ICONS[cat.icon] ?? Flame;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
      style={{
        background: active ? "#1c1209" : "#fff",
        color: active ? "#fefdf8" : "#5c3d1e",
        border: active ? "none" : "1px solid #e8dfc8",
        boxShadow: active ? "0 10px 24px -8px rgba(45,31,20,.4)" : "0 1px 3px rgba(45,31,20,.06)",
        position: "relative",
      }}
    >
      <Icon size={16} />
      <span>{cat.label}</span>
      {count > 0 && (
        <span
          className="text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: active ? "#f59e0b" : "#d97706",
            color: active ? "#1c1209" : "#fff",
            fontSize: 10,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
