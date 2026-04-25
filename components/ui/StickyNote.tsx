import React from "react";

interface StickyNoteProps {
  type?: React.ReactNode;
  text?: React.ReactNode;
  children?: React.ReactNode;
  pinColor?: string;
  bgColor?: string;
  positionClass?: string;
  isAbsolute?: boolean;
}

export default function StickyNote({
  type,
  text,
  children,
  pinColor = "#ef4444",
  bgColor = "#fef3c7",
  positionClass = "",
  isAbsolute = true,
}: StickyNoteProps) {
  return (
    <div
      className={`${isAbsolute ? "absolute" : "relative"} ${positionClass} p-3 rounded-sm shadow-[0_10px_22px_-8px_rgba(45,31,20,0.3),0_2px_4px_rgba(45,31,20,0.1)] transition-transform duration-500 hover:rotate-3 origin-top dark:opacity-90 z-20 cursor-default select-text`}
      style={{
        backgroundColor: bgColor,
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, transparent 12%)",
      }}
    >
      <style>{`
        @keyframes pin-wobble {
          0%, 100% { transform: translateX(-50%) rotate(0deg); }
          25% { transform: translateX(-50%) rotate(-5deg); }
          75% { transform: translateX(-50%) rotate(5deg); }
        }
      `}</style>

      {/* Realistic Thumb Pin */}
      <div
        style={{
          position: "absolute",
          top: -10,
          left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "bottom center",
          animation: "pin-wobble 4s ease-in-out infinite",
          width: 24,
          height: 24,
          zIndex: 30,
        }}
      >
        {/* Shadow cast by the pin */}
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 12,
            width: 12,
            height: 12,
            backgroundColor: "rgba(0,0,0,0.25)",
            borderRadius: "50%",
            transform: "translate(4px, 4px)",
            filter: "blur(2px)",
            zIndex: 1,
          }}
        />

        {/* Pin Base Rim */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: pinColor,
            backgroundImage:
              "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(0,0,0,0.2) 100%)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 2,
          }}
        />

        {/* Pin Handle / Stem */}
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 5,
            width: 14,
            height: 14,
            borderRadius: "50%",
            backgroundColor: pinColor,
            backgroundImage:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 40%, rgba(0,0,0,0.4) 100%)",
            boxShadow:
              "0 3px 5px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.6)",
            zIndex: 3,
          }}
        >
          {/* Specular Highlight */}
          <div
            style={{
              position: "absolute",
              top: 2,
              left: 2,
              width: 3,
              height: 3,
              backgroundColor: "#fff",
              borderRadius: "50%",
              filter: "blur(0.5px)",
            }}
          />
        </div>
      </div>

      {children ? (
        children
      ) : (
        <>
          <div className="text-[10px] font-black tracking-[0.15em] uppercase text-amber-900/60 dark:text-amber-900/80 mb-1 leading-tight">
            {type}
          </div>
          <div className="font-serif italic text-[15px] font-medium leading-snug text-brown-900 dark:text-brown-900">
            {text}
          </div>
        </>
      )}
    </div>
  );
}
