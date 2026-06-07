import { DEFAULT_ETAPE_COLOR } from "@/lib/color";

type ProgressBarProps = {
  percentage?: number;
  color?: string;
  label?: string;
  ariaLabel?: string;
  completed?: boolean;
};

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

  return (
    <div
      aria-label={ariaLabel ?? label ?? `Progression ${pct}%`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={pct}
      className="relative flex h-16 w-full items-center overflow-hidden rounded-[35px]"
      role="progressbar"
    >
      {!isComplete ? (
        <div
          className="absolute inset-y-0 right-0 overflow-hidden rounded-[35px]"
          style={{ left: `calc(${pct}% - 14px)`, border: `1px solid ${color}` }}
        >
          <div className="absolute -top-[220%] w-full">
            <div className="relative flex flex-col items-center justify-center gap-[5px]">
              {Array.from({ length: 80 }).map((_, i) => (
                <div
                  key={i}
                  className="h-px w-[200%] rotate-[135deg]"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div
        className="progress-fill absolute inset-y-0 left-0 z-[1] rounded-[35px] border border-white"
        style={{
          width: `${pct}%`,
          background:
            "linear-gradient(108deg, rgba(238,238,238,0.26) 0%, rgba(238,238,238,0.13) 100%)",
          backdropFilter: "blur(10px)",
        }}
      />

      <div
        className="absolute top-1/2 z-[2] flex items-center gap-[7px]"
        style={{
          left: `clamp(${BADGE_HALF_WIDTH}, ${pct}%, calc(100% - ${BADGE_HALF_WIDTH}))`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {label ? <span className="text-base font-medium">{label}</span> : null}
        <div className="flex items-center gap-[5px] rounded-[15px] bg-white px-[6px] py-[4px]">
          <span
            className="h-[5px] w-[5px] rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="text-base font-medium whitespace-nowrap">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
