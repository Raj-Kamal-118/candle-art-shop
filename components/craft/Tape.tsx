// Cello-tape / washi-tape primitive
// Position: absolute; caller must set top/left and rotation via className.

const TAPE_COLORS: Record<string, string> = {
  amber:   "rgba(253,230,138,0.70)",
  blue:    "rgba(186,230,253,0.75)",
  pink:    "rgba(252,165,165,0.60)",
  mint:    "rgba(167,243,208,0.75)",
  lavender:"rgba(221,214,254,0.75)",
  kraft:   "rgba(168,121,79,0.55)",
};

const TAPE_COLORS_DARK: Record<string, string> = {
  amber:   "rgba(253,230,138,0.35)",
  blue:    "rgba(186,230,253,0.30)",
  pink:    "rgba(252,165,165,0.30)",
  mint:    "rgba(167,243,208,0.30)",
  lavender:"rgba(221,214,254,0.30)",
  kraft:   "rgba(168,121,79,0.35)",
};

export type TapeColor = keyof typeof TAPE_COLORS;

interface TapeProps {
  color?: TapeColor;
  width?: number;
  height?: number;
  rotate?: number;
  className?: string;
  dark?: boolean;
}

export default function Tape({
  color = "amber",
  width = 100,
  height = 24,
  rotate = -3,
  className = "",
}: TapeProps) {
  return (
    <>
      {/* Light mode tape */}
      <span
        className={`craft-tape absolute pointer-events-none dark:hidden ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotate}deg)`,
          background: TAPE_COLORS[color] ?? TAPE_COLORS.amber,
        }}
      />
      {/* Dark mode tape */}
      <span
        className={`craft-tape absolute pointer-events-none hidden dark:block ${className}`}
        style={{
          width,
          height,
          transform: `rotate(${rotate}deg)`,
          background: TAPE_COLORS_DARK[color] ?? TAPE_COLORS_DARK.amber,
        }}
      />
    </>
  );
}

// Cycle through colors for items based on index
export const TAPE_CYCLE: TapeColor[] = ["amber", "blue", "pink", "mint", "lavender"];
export function tapeForIndex(index: number): TapeColor {
  return TAPE_CYCLE[index % TAPE_CYCLE.length];
}
