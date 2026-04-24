"use client";

import { Product } from "@/lib/types";
import { GS_RIBBONS, GS_BOXES } from "@/lib/stores/giftBuilderStore";

interface BoxPreviewProps {
  items?: Product[];
  ribbon?: string;
  box?: string;
  recipient?: string;
  wrap?: boolean;
  big?: boolean;
  tiny?: boolean;
}

export default function BoxPreview({
  items = [],
  ribbon = "cream",
  box = "kraft",
  recipient = "",
  wrap = false,
  big = false,
  tiny = false,
}: BoxPreviewProps) {
  const ribbonColor = (GS_RIBBONS.find((r) => r.id === ribbon) ?? GS_RIBBONS[0]).color;
  const boxDef = GS_BOXES.find((b) => b.id === box) ?? GS_BOXES[0];
  const boxColor = boxDef.color;
  const boxShadow =
    box === "forest" ? "#0a1f15" :
    box === "cream"  ? "#e8dbb8" :
    box === "blush"  ? "#d9a8a2" : "#a8865a";

  const size  = tiny ? 120 : big ? 480 : 360;
  const depth = tiny ? 14  : big ? 54  : 40;

  const visibleItems = items.slice(0, 6);
  const extra = items.length > 6 ? items.length - 6 : 0;

  return (
    <div style={{ position: "relative", width: size, height: size * 0.9, margin: "0 auto" }}>
      {/* Ambient glow */}
      {!tiny && (
        <div
          style={{
            position: "absolute", inset: -40, pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 55%, ${ribbonColor}33, transparent 60%), radial-gradient(ellipse at 50% 70%, #fde68a44, transparent 55%)`,
            filter: "blur(10px)",
          }}
        />
      )}

      {/* Box body */}
      <div
        style={{
          position: "absolute", left: "50%", top: "55%",
          transform: "translate(-50%,-50%) rotateX(14deg) rotateZ(-2deg)",
          transformStyle: "preserve-3d",
          width: size * 0.85, height: size * 0.55,
          background: boxColor, borderRadius: 8,
          boxShadow: `0 ${depth / 2}px ${depth * 2}px -${Math.round(depth / 3)}px rgba(45,31,20,.25), inset 0 ${tiny ? 1 : 3}px 0 rgba(255,255,255,.3), inset 0 -${tiny ? 4 : 14}px ${tiny ? 4 : 20}px ${boxShadow}66`,
          transition: "all .4s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {/* Tissue paper */}
        {!tiny && (
          <div
            style={{
              position: "absolute", inset: 10, top: 6, bottom: "auto", height: 40,
              background: "linear-gradient(180deg,#fff 0%,#fdfcf9 100%)",
              borderRadius: 4, opacity: 0.9,
              clipPath: "polygon(0% 0%,18% 60%,35% 20%,52% 75%,68% 30%,85% 65%,100% 20%,100% 0%)",
            }}
          />
        )}

        {/* Products fanned inside */}
        {!tiny && visibleItems.length > 0 && (
          <div
            style={{
              position: "absolute", left: "50%", top: "50%",
              transform: "translate(-50%,-45%)",
              width: "86%", height: "78%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {visibleItems.map((product, i) => {
              const img = product.images?.[0] ?? "";
              const n = visibleItems.length;
              const spread = n === 1 ? 0 : 8;
              const rot = (i - (n - 1) / 2) * spread;
              const dx  = (i - (n - 1) / 2) * (size * 0.09);
              return (
                <div
                  key={`${product.id}-${i}`}
                  style={{
                    position: "absolute",
                    width: size * 0.28, height: size * 0.32,
                    borderRadius: 8, overflow: "hidden",
                    boxShadow: "0 6px 14px -4px rgba(45,31,20,.4)",
                    transform: `translateX(${dx}px) rotate(${rot}deg)`,
                    transition: "transform .35s cubic-bezier(.22,1,.36,1)",
                    zIndex: 5 + i, border: "2px solid #fff",
                  }}
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#f9f5ee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🎁</div>
                  )}
                </div>
              );
            })}
            {extra > 0 && (
              <div
                style={{
                  position: "absolute", right: "5%", bottom: "10%",
                  background: "rgba(45,31,20,.7)", color: "#fff",
                  fontSize: 11, fontWeight: 700, padding: "3px 7px", borderRadius: 10, zIndex: 20,
                }}
              >
                +{extra}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ribbon vertical strip */}
      {!tiny && (
        <div
          style={{
            position: "absolute", left: "50%", top: "22%",
            transform: "translateX(-50%) rotateX(14deg)",
            width: size * 0.15, height: size * 0.65,
            background: ribbonColor,
            boxShadow: "inset 0 0 12px rgba(0,0,0,.12), 0 4px 10px -2px rgba(45,31,20,.2)",
            borderRadius: 2, transition: "background .4s",
          }}
        />
      )}

      {/* Ribbon bow */}
      {!tiny && (
        <div style={{ position: "absolute", left: "50%", top: "20%", transform: "translateX(-50%)", width: size * 0.4, height: size * 0.18, pointerEvents: "none" }}>
          <div style={{ position: "absolute", left: 0, top: "30%", width: "45%", height: "50%", background: ribbonColor, borderRadius: "50% 0 60% 40% / 50% 0 60% 40%", boxShadow: "inset 0 -4px 8px rgba(0,0,0,.12)" }} />
          <div style={{ position: "absolute", right: 0, top: "30%", width: "45%", height: "50%", background: ribbonColor, borderRadius: "0 50% 40% 60% / 0 50% 40% 60%", boxShadow: "inset 0 -4px 8px rgba(0,0,0,.12)" }} />
          <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translateX(-50%)", width: "18%", height: "60%", background: ribbonColor, filter: "brightness(.85)", borderRadius: 3 }} />
        </div>
      )}

      {/* Gift tag */}
      {!tiny && recipient && (
        <div
          style={{
            position: "absolute", right: "-6%", top: "54%",
            width: size * 0.26, transform: "rotate(6deg)",
            padding: "10px 12px 14px",
            background: "#fdfcf9", border: "1px solid #e8dfc8", borderRadius: 2,
            boxShadow: "0 6px 14px -2px rgba(45,31,20,.2)",
            fontSize: 11, color: "#5c3d1e", fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.3,
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#b45309", marginBottom: 4, fontStyle: "normal" }}>For</div>
          {recipient}
          <div style={{ position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#6b4226" }} />
        </div>
      )}

      {/* Wrap burst */}
      {wrap && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <style>{`
            @keyframes gs-burst {
              0%   { opacity:0; transform:translate(0,0) scale(0); }
              30%  { opacity:1; }
              100% { opacity:0; transform:translate(var(--tx,0px),var(--ty,0px)) scale(0); }
            }
            @media (prefers-reduced-motion:reduce) { .gs-particle { display:none; } }
          `}</style>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const d = size * 0.55;
            const tx = Math.round(Math.cos(angle) * d);
            const ty = Math.round(Math.sin(angle) * d);
            return (
              <div
                key={i}
                className="gs-particle"
                style={{
                  position: "absolute", left: "50%", top: "50%",
                  width: 8, height: 8, borderRadius: "50%",
                  background: i % 2 === 0 ? "#f59e0b" : "#e07a5f",
                  // @ts-expect-error CSS custom props
                  "--tx": `${tx}px`, "--ty": `${ty}px`,
                  animation: `gs-burst .9s cubic-bezier(.22,1,.36,1) forwards`,
                  animationDelay: `${i * 30}ms`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
