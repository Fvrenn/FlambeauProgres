import { DEFAULT_ETAPE_COLOR, withAlpha } from "@/lib/color";

type ProgressBarProps = {
  percentage?: number;
  color?: string;
  label?: string;
  ariaLabel?: string;
  completed?: boolean;
};

const INSET = 5;
const inset = `${INSET}px`;
const BADGE_HALF_WIDTH = "2rem";

export default function ProgressBar({
  percentage = 0,
  color = DEFAULT_ETAPE_COLOR,
  label,
  ariaLabel,
  completed,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(percentage)));
  const isComplete = completed ?? pct >= 100;
  const hasFill = pct > 0;

  return (
    <div
      aria-label={ariaLabel ?? label ?? `Progression ${pct}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={pct}
      className="relative h-16 w-full overflow-hidden rounded-full"
      role="progressbar"
      style={{
        border: `1px solid ${withAlpha(color, 0.4)}`,
        backgroundColor: withAlpha(color, 0.06),
      }}
    >
      {!isComplete ? (
        <div
          className="absolute rounded-full"
          style={{
            inset,
            backgroundImage: `repeating-linear-gradient(135deg, ${withAlpha(color, 0.6)} 0, ${withAlpha(color, 0.6)} 1px, transparent 1px, transparent 6px)`,
          }}
        />
      ) : null}

      {hasFill ? (
        <div
          className="progress-fill absolute z-[1] rounded-full border border-white/70"
          style={{
            top: inset,
            bottom: inset,
            left: inset,
            width: `max(1.25rem, calc(${pct}% - ${INSET * 2}px))`,
            background:
              "linear-gradient(108deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.28) 100%)",
            backdropFilter: "blur(10px)",
          }}
        />
      ) : null}

      <div
        className="absolute top-1/2 z-[2] flex items-center gap-[7px]"
        style={{
          left: `clamp(${BADGE_HALF_WIDTH}, ${pct}%, calc(100% - ${BADGE_HALF_WIDTH}))`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {label ? <span className="text-base font-medium">{label}</span> : null}
        <div className="flex items-center gap-[5px] rounded-[15px] bg-white px-[6px] py-[4px] shadow-sm">
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-base font-medium whitespace-nowrap text-black">
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}
