interface ManilaTagProps {
  value: string;
  label?: string;
  strikethrough?: string;
  className?: string;
}

export default function ManilaTag({
  value,
  label,
  strikethrough,
  className = "",
}: ManilaTagProps) {
  return (
    <span className={`manila-tag ${className}`}>
      <span className="flex flex-col gap-0.5">
        {label && <span className="mt-label">{label}</span>}
        <span className="flex items-baseline gap-1">
          <span className="mt-value">{value}</span>
          {strikethrough && <span className="mt-strike">{strikethrough}</span>}
        </span>
      </span>
    </span>
  );
}
