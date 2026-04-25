// HomeV2 — Pinboard testimonials section
// "Stories of warmth" reimagined as a cork board with mixed pinned notes.
// Drop-in replacement for the simple sticky-card grid.

function PinboardTestimonials({ reviews }) {
  // Curated 6 reviews with intentional layout positions on a 12-col / 3-row grid.
  // Each has its own paper style, pin, tilt, and size — like a real pinboard.
  const data = reviews && reviews.length >= 6 ? reviews : [
    { stars: 4, q: "Liked it. The quality is exactly what I was hoping for. Delivery was on time and the item was packed safely. I highly recommend this store.", name: "Ayush Sahay",   loc: "Khanmichak",  product: "Custom Magnet" },
    { stars: 4, q: "Well-Crafted Magnets. Loved the detailing on the product. Looks great on my fridge and holds up papers securely. Will definitely buy more designs soon.",                      name: "Raj Kamal",     loc: "Patna",       product: "Fridge Magnet" },
    { stars: 5, q: "The Amber Rose candle is absolutely divine. The scent fills my apartment without being overwhelming, and it burns so evenly. Already ordered three more as gifts!",          name: "Saurabh K.",    loc: "Delhi",       product: "Happy Octopus" },
    { stars: 5, q: "The fragrance was too good. Loved the product and customer support — they answered every question politely before I placed the order.",                                       name: "Shreya Rastogi",loc: "Varanasi",    product: "Pillar Candle" },
    { stars: 4, q: "Nice service. The handwritten note in the box made my day. The glass jar is sturdy and can be reused once the wax is finished.",                                              name: "Alka R.",       loc: "Lucknow",     product: "Glass Candle" },
    { stars: 5, q: "Really liking the keyring. Feels durable, the colors are bright. Perfect size for my keys without being too bulky. Many compliments already.",                                name: "Kamal R.",      loc: "India",       product: "The Sleepy Fox" },
  ];

  // Per-card style — paper, pin, position. Hand-tuned for rhythm.
  const layouts = [
    { paper: "yellow-legal", pin: { kind: "brass" },              col: "1 / span 4", row: "1",          rot: -4, w: "100%", overflow: "12px 0 0 0", anchor: false },
    { paper: "blue-index",   pin: { kind: "round", c: "#3b82f6" }, col: "5 / span 4", row: "1",          rot: 2,  w: "100%", overflow: "0 0 0 0",   anchor: true  },
    { paper: "kraft-torn",   pin: { kind: "round", c: "#dc2626" }, col: "9 / span 4", row: "1",          rot: -2, w: "100%", overflow: "0 0 0 0",   anchor: false },
    { paper: "ruled-card",   pin: { kind: "wood" },               col: "2 / span 4", row: "2",          rot: 3,  w: "100%", overflow: "0 0 0 0",   anchor: false },
    { paper: "pink-memo",    pin: { kind: "tape", c: "rgba(245,230,200,.85)", angle: 18 }, col: "6 / span 4", row: "2",     rot: -3, w: "100%", overflow: "0 0 0 0", anchor: false },
    { paper: "mint-note",    pin: { kind: "round", c: "#dc2626" }, col: "10 / span 4", row: "2",         rot: 4,  w: "100%", overflow: "0 0 0 0",   anchor: false },
  ];

  return (
    <section style={{ padding: "100px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* Section header — handwritten label */}
        <div style={{ textAlign: "center", marginBottom: 48, position: "relative", zIndex: 2 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            background: "#fef9f0",
            border: "1px solid rgba(180,83,9,.18)",
            padding: "10px 22px", borderRadius: 4,
            transform: "rotate(-1.5deg)",
            boxShadow: "0 4px 10px -2px rgba(45,31,20,.12)",
            fontFamily: "var(--font-hand)", fontSize: 16, color: "var(--brown-700)",
            letterSpacing: ".08em",
          }}>
            <span>✦</span><span style={{ fontWeight: 600 }}>letters · notes · thank-yous</span><span>✦</span>
          </div>
          <h2 style={{
            fontFamily: "var(--font-serif)", fontSize: "clamp(48px, 6vw, 76px)",
            fontWeight: 500, color: "var(--brown-900)", letterSpacing: "-.025em",
            margin: "20px 0 12px", lineHeight: 1,
          }}>
            Stories of{" "}
            <span style={{ position: "relative", fontFamily: "var(--font-hand)", color: "var(--coral-600)", fontWeight: 600, display: "inline-block" }}>
              warmth
              <span style={{ position: "absolute", left: 0, bottom: -2, width: "100%" }}>
                <Scribble color="var(--coral-500)" kind="underline" />
              </span>
            </span>
          </h2>
          <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "var(--brown-600)", fontSize: 17, margin: 0 }}>
            From the people who let us into their homes, their mornings, and their Tuesdays.
          </p>
        </div>

        {/* The pinboard */}
        <div style={{
          position: "relative",
          padding: "60px 50px 70px",
          borderRadius: 12,
          background: corkBoardBg,
          backgroundColor: "#caa978",
          boxShadow: "inset 0 4px 14px rgba(45,31,20,.35), inset 0 -4px 10px rgba(45,31,20,.25), 0 30px 60px -20px rgba(45,31,20,.25)",
          border: "10px solid #5b3a1f",
          borderImage: "linear-gradient(135deg, #6e4527, #3e2614 50%, #6e4527) 1",
        }}>
          {/* Subtle shadow vignette inside the board */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(45,31,20,.18) 100%)",
            borderRadius: 4,
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, 1fr)",
            gridAutoRows: "auto",
            gap: "44px 28px",
            position: "relative",
            alignItems: "start",
          }}>
            {data.slice(0, 6).map((r, i) => {
              const L = layouts[i];
              return (
                <div key={i} style={{ gridColumn: L.col, gridRow: L.row, position: "relative" }}>
                  <PinNote review={r} layout={L} />
                </div>
              );
            })}
          </div>

          {/* Loose extras on the board for character */}
          {/* Postage stamp in top-right */}
          <div aria-hidden style={{
            position: "absolute", top: 14, right: 18, width: 56, height: 64,
            background: "var(--coral-500)", padding: 4, borderRadius: 1,
            backgroundImage: "radial-gradient(circle, var(--coral-500) 4px, transparent 5px)",
            backgroundSize: "8px 8px",
            transform: "rotate(8deg)",
            boxShadow: "0 4px 8px rgba(45,31,20,.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 11,
            textAlign: "center", lineHeight: 1.1, fontWeight: 600,
          }}>
            <div>A.H.<br/>est. 2019</div>
          </div>

          {/* Loose paper clip in bottom-left */}
          <svg aria-hidden style={{ position: "absolute", bottom: 18, left: 18, transform: "rotate(-15deg)" }} width="40" height="56" viewBox="0 0 40 56">
            <path d="M28 6 L 28 44 Q 28 50 22 50 Q 16 50 16 44 L 16 12 Q 16 6 22 6 Q 28 6 28 12 L 28 38" fill="none" stroke="#9aa0a6" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Little doodle/star sticker bottom-right */}
          <div aria-hidden style={{
            position: "absolute", bottom: 20, right: 36, width: 50, height: 50,
            transform: "rotate(-12deg)", color: "var(--amber-500)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-hand)", fontSize: 28, fontWeight: 700,
          }}>
            <svg viewBox="0 0 50 50" width="50" height="50">
              <path d="M25 4 L 30 18 L 45 20 L 34 30 L 38 45 L 25 37 L 12 45 L 16 30 L 5 20 L 20 18 Z"
                fill="#fef3c7" stroke="var(--amber-700)" strokeWidth="1.5" strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 2px 3px rgba(45,31,20,.3))" }} />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
function PinNote({ review, layout }) {
  const paperStyles = {
    "yellow-legal": {
      bg: "#fef3c7",
      bgImage: "repeating-linear-gradient(0deg, transparent 0 27px, rgba(180,83,9,.18) 27px 28px)",
      borderColor: "rgba(180,83,9,.15)",
      ink: "#3a2a1c",
      accent: "#b45309",
    },
    "blue-index": {
      bg: "#e0f2fe",
      bgImage: "repeating-linear-gradient(0deg, transparent 0 27px, rgba(2,132,199,.22) 27px 28px)",
      borderColor: "rgba(2,132,199,.18)",
      ink: "#0c4a6e",
      accent: "#0369a1",
      leftMargin: { color: "rgba(220,38,38,.4)", offset: 36 },
    },
    "kraft-torn": {
      bg: "#d4b88a",
      bgImage: `
        repeating-linear-gradient(135deg, transparent 0 3px, rgba(255,255,255,.04) 3px 4px),
        radial-gradient(circle at 30% 40%, rgba(120,80,30,.08) 0 1.5px, transparent 2px),
        radial-gradient(circle at 70% 60%, rgba(120,80,30,.08) 0 1.5px, transparent 2px)
      `,
      backgroundSize: "100% 100%, 80px 80px, 60px 60px",
      borderColor: "rgba(70,40,15,.3)",
      ink: "#3a2a1c",
      accent: "#7a2a14",
      torn: true,
    },
    "ruled-card": {
      bg: "#fffaf0",
      bgImage: "repeating-linear-gradient(0deg, transparent 0 26px, rgba(120,80,40,.18) 26px 27px)",
      borderColor: "rgba(120,80,40,.18)",
      ink: "#2d1f14",
      accent: "#b45309",
      leftMargin: { color: "rgba(220,38,38,.45)", offset: 32 },
    },
    "pink-memo": {
      bg: "#fde4dd",
      bgImage: "repeating-linear-gradient(0deg, transparent 0 27px, rgba(201,83,51,.2) 27px 28px)",
      borderColor: "rgba(201,83,51,.18)",
      ink: "#7a2a14",
      accent: "#c95333",
    },
    "mint-note": {
      bg: "#d7e4d0",
      bgImage: "repeating-linear-gradient(0deg, transparent 0 27px, rgba(47,82,51,.2) 27px 28px)",
      borderColor: "rgba(47,82,51,.18)",
      ink: "#10261a",
      accent: "#2f5233",
    },
  };
  const p = paperStyles[layout.paper] || paperStyles["yellow-legal"];

  // Pin renderer
  const Pin = () => {
    if (layout.pin.kind === "tape") {
      return (
        <div aria-hidden style={{
          position: "absolute",
          top: -10, left: "50%",
          width: 78, height: 22,
          transform: `translateX(-50%) rotate(${layout.pin.angle || 0}deg)`,
          background: layout.pin.c || "rgba(245,230,200,.85)",
          backgroundImage: "repeating-linear-gradient(90deg, transparent 0 4px, rgba(0,0,0,.04) 4px 5px)",
          boxShadow: "0 2px 4px rgba(45,31,20,.18)",
          borderLeft: "1px dashed rgba(0,0,0,.06)",
          borderRight: "1px dashed rgba(0,0,0,.06)",
        }} />
      );
    }
    if (layout.pin.kind === "wood") {
      return (
        <div aria-hidden style={{
          position: "absolute", top: -8, left: 16,
          width: 16, height: 16, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #d4a574 0%, #8b5a2b 50%, #4a2a14 100%)",
          boxShadow: "0 3px 5px rgba(45,31,20,.4), inset -1px -1px 2px rgba(0,0,0,.4)",
        }} />
      );
    }
    if (layout.pin.kind === "brass") {
      return (
        <div aria-hidden style={{
          position: "absolute", top: -8, right: 18,
          width: 14, height: 14, borderRadius: "50%",
          background: "radial-gradient(circle at 35% 30%, #fef3c7 0%, #f59e0b 35%, #92400e 100%)",
          boxShadow: "0 3px 5px rgba(45,31,20,.4), inset -1px -1px 1px rgba(0,0,0,.3)",
        }} />
      );
    }
    // round colored
    const c = layout.pin.c || "#dc2626";
    return (
      <div aria-hidden style={{
        position: "absolute", top: -9, left: "50%", transform: "translateX(-50%)",
        width: 18, height: 18, borderRadius: "50%",
        background: `radial-gradient(circle at 35% 30%, #fff 0%, ${c} 30%, ${c} 70%, rgba(0,0,0,.5) 100%)`,
        boxShadow: "0 4px 6px rgba(45,31,20,.45), inset -1px -1px 2px rgba(0,0,0,.3)",
      }} />
    );
  };

  // Render stars as inked ticks for craft feel — keep simple star SVG, hand-look stroke
  const Stars = ({ n }) => (
    <div style={{ display: "inline-flex", gap: 3, color: p.accent, flexShrink: 0 }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill={i < n ? p.accent : "transparent"} stroke={p.accent} strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 2 L 14.5 8.5 L 21.5 9 L 16 13.5 L 18 20.5 L 12 16.5 L 6 20.5 L 8 13.5 L 2.5 9 L 9.5 8.5 Z" />
        </svg>
      ))}
    </div>
  );

  return (
    <div style={{
      width: layout.w,
      transform: `rotate(${layout.rot}deg)`,
      transformOrigin: "top center",
      position: "relative",
      transition: "transform .25s",
    }}>
      <div style={{
        background: p.bg,
        backgroundImage: p.bgImage,
        backgroundSize: p.backgroundSize || "auto",
        padding: layout.paper === "kraft-torn" ? "28px 24px 22px" : "26px 24px 22px",
        paddingLeft: p.leftMargin ? p.leftMargin.offset + 16 : 24,
        borderRadius: layout.paper === "kraft-torn" ? "6px 14px 4px 10px" : 3,
        border: `1px solid ${p.borderColor}`,
        boxShadow: `
          0 2px 4px rgba(45,31,20,.15),
          0 12px 28px -12px rgba(45,31,20,.45),
          0 1px 0 rgba(255,255,255,.5) inset
        `,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        // torn-edge mask for kraft
        clipPath: layout.paper === "kraft-torn"
          ? "polygon(2% 4%, 8% 1%, 18% 3%, 32% 0%, 48% 2%, 62% 1%, 75% 3%, 88% 1%, 96% 4%, 100% 14%, 99% 32%, 100% 48%, 99% 64%, 100% 80%, 97% 96%, 88% 99%, 72% 97%, 56% 100%, 40% 98%, 24% 100%, 12% 98%, 4% 96%, 1% 84%, 0% 64%, 2% 48%, 0% 30%, 2% 14%)"
          : "none",
      }}>
        <Pin />

        {/* Optional left red margin line */}
        {p.leftMargin && (
          <div aria-hidden style={{
            position: "absolute", top: 0, bottom: 0,
            left: p.leftMargin.offset, width: 1,
            background: p.leftMargin.color,
          }} />
        )}

        <Stars n={review.stars} />

        <div style={{
          fontFamily: "var(--font-hand)",
          fontSize: 19,
          lineHeight: "28px",
          color: p.ink,
          letterSpacing: ".005em",
          flex: "1 1 auto",
        }}>
          "{review.q}"
        </div>

        {/* Author block — torn label feel */}
        <div style={{
          display: "flex", alignItems: "baseline", gap: 8,
          flexWrap: "wrap",
          paddingTop: 12,
          borderTop: `1px dashed ${p.borderColor}`,
          flexShrink: 0,
          marginTop: "auto",
        }}>
          <div style={{
            fontFamily: "var(--font-serif)",
            fontSize: 14,
            fontWeight: 600,
            color: p.ink,
            letterSpacing: "-.005em",
          }}>— {review.name}</div>
          <div style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 12,
            color: p.ink,
            opacity: .7,
          }}>{review.loc} · {review.product}</div>
        </div>
      </div>
    </div>
  );
}

// Cork board background — layered radial dots + base color
const corkBoardBg = `
  radial-gradient(circle at 12% 22%, rgba(85,55,25,.18) 0 2px, transparent 3px),
  radial-gradient(circle at 38% 65%, rgba(85,55,25,.15) 0 1.6px, transparent 2.5px),
  radial-gradient(circle at 72% 18%, rgba(85,55,25,.18) 0 2.2px, transparent 3px),
  radial-gradient(circle at 88% 78%, rgba(85,55,25,.16) 0 1.8px, transparent 2.5px),
  radial-gradient(circle at 28% 88%, rgba(85,55,25,.15) 0 1.5px, transparent 2.5px),
  radial-gradient(circle at 58% 38%, rgba(85,55,25,.12) 0 1.2px, transparent 2px),
  radial-gradient(ellipse at 30% 30%, rgba(255,225,175,.2), transparent 60%),
  radial-gradient(ellipse at 80% 70%, rgba(120,75,30,.18), transparent 60%)
`;

Object.assign(window, { PinboardTestimonials });
