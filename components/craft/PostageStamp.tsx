import React from "react";

export type StampKind = "coral" | "mint" | "cream" | "gold";
export type StampTilt = "left" | "right" | "none";

interface PostageStampProps {
  label: string;
  denom: React.ReactNode;
  illustration?: React.ReactNode;
  kind?: StampKind;
  tilt?: StampTilt;
  className?: string;
}

const KIND_CLASS: Record<StampKind, string> = {
  coral: "",
  mint: "kind-mint",
  cream: "kind-cream",
  gold: "kind-gold",
};

const TILT_CLASS: Record<StampTilt, string> = {
  left: "tilt-l",
  right: "tilt-r",
  none: "",
};

export default function PostageStamp({
  label,
  denom,
  illustration,
  kind = "coral",
  tilt = "none",
  className = "",
}: PostageStampProps) {
  const cls = ["stamp-mini", KIND_CLASS[kind], TILT_CLASS[tilt], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={cls}>
      <span className="inner">
        <span className="label">{label}</span>
        {illustration && <span className="ill">{illustration}</span>}
        <span className="denom">{denom}</span>
      </span>
    </span>
  );
}
