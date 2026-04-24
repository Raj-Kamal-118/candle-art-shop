"use client";

import { Cake, Flame, Heart, Star, Home, Mail, Leaf, Briefcase } from "lucide-react";

const OCCASION_ICONS: Record<string, React.ElementType> = {
  birthday: Cake,
  diwali: Flame,
  wedding: Heart,
  anni: Star,
  housewarm: Home,
  thank: Mail,
  selfcare: Leaf,
  newjob: Briefcase,
};

export const GS_OCCASIONS = [
  { id: "birthday", label: "Birthday" },
  { id: "diwali",   label: "Diwali" },
  { id: "wedding",  label: "Wedding" },
  { id: "anni",     label: "Anniversary" },
  { id: "housewarm",label: "Housewarming" },
  { id: "thank",    label: "Thank you" },
  { id: "selfcare", label: "Self-care" },
  { id: "newjob",   label: "New job" },
];

interface OccasionFilterProps {
  active: string;
  onChange: (id: string) => void;
}

export default function OccasionFilter({ active, onChange }: OccasionFilterProps) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      <button
        onClick={() => onChange("all")}
        className="px-4 py-2 rounded-full text-sm font-medium transition-all"
        style={{
          border: `1px solid ${active === "all" ? "#1c1209" : "#e8dfc8"}`,
          background: active === "all" ? "#1c1209" : "transparent",
          color: active === "all" ? "#fefdf8" : "#5c3d1e",
          cursor: "pointer",
        }}
      >
        All
      </button>
      {GS_OCCASIONS.map((o) => {
        const Icon = OCCASION_ICONS[o.id] ?? Flame;
        const isActive = active === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              border: `1px solid ${isActive ? "#1c1209" : "#e8dfc8"}`,
              background: isActive ? "#1c1209" : "transparent",
              color: isActive ? "#fefdf8" : "#5c3d1e",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Icon size={14} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
