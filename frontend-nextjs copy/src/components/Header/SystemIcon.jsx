<svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mr-2">
  <path
    d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
    stroke-width="2"
    stroke-linejoin="round"
    className="stroke-slate-400 dark:stroke-slate-500"
  ></path>
  <path
    d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="stroke-slate-400 dark:stroke-slate-500"
  ></path>
</svg>;

import React from "react";
export const SystemIcon = ({
  size = 22,
  width,
  height,
  strokeWidth = 2,
  theme,
  ...props
}) => (
  <>
    {theme === "system" ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" {...props}>
        <path
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className="stroke-sky-500 fill-sky-400/20"
        ></path>
        <path
          d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className="stroke-sky-500"
        ></path>
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" {...props}>
        <path
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className={`stroke-slate-400   ${
            theme === "dark" ? "dark:stroke-slate-50" : ""
          }`}
        ></path>
        <path
          d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className={`stroke-slate-400   ${
            theme === "dark" ? "dark:stroke-slate-50" : ""
          }`}
        ></path>
      </svg>
    )}
  </>
);
