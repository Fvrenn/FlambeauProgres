import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

export default function ProgressBar({ percentage = 0, label = "Étapes construction" }) {
  const totalWidth = 511;
  const contentRef = useRef<HTMLDivElement>(null);
  const [minFilledWidth, setMinFilledWidth] = useState(0);
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setMinFilledWidth(contentRef.current.offsetWidth + 100);
    }
  }, [label, percentage]);

  useEffect(() => {
    setShow(true);
  }, []);

  const filledWidth = Math.max(minFilledWidth, (percentage / 100) * totalWidth);
  const emptyWidth = Math.max(0, totalWidth - filledWidth);

  return (
    <div className="flex items-center" style={{ width: totalWidth }}>
      <div
        className="z-[1] h-16 rounded-[35px] gap-[7px] px-[10px] py-[8px] flex justify-center items-center flex-shrink-0 border border-white transition-all duration-300"
        style={{
          width: filledWidth,
          minWidth: minFilledWidth,
          background:
            "linear-gradient(108deg, rgba(238,238,238,0.26) 0%, rgba(238,238,238,0.13) 100%)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div
          ref={contentRef}
          className={`flex items-center gap-[7px] transition-all duration-1000
            ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
          `}
        >
          <span className="text-base font-medium">{label}</span>
          <div className="bg-white rounded-[15px] px-[6px] py-[4px] flex items-center gap-[5px]">
            <span className="h-[5px] w-[5px] rounded-full bg-success whitespace-nowrap"></span>
            <span className="text-base font-medium">{percentage}%</span>
          </div>
        </div>
      </div>
      <div
        className="h-16 rounded-[35px] border border-success relative overflow-hidden -ml-[14px] transition-all duration-300"
        style={{ width: emptyWidth }}
      >
        <div className="absolute w-full -top-[220%]">
          <div className="flex gap-[5px] flex-col justify-center items-center relative">
            {Array.from({ length: 80 }).map((_, i) => (
              <div
                className="h-px w-[200%] bg-success rotate-[135deg]"
                key={i}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}