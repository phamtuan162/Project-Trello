import React from "react";
const DarkIcon = ({
  size = 22,
  width,
  height,
  strokeWidth = 2,
  theme,
  ...props
}) => (
  <>
    {theme === "dark" ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
          className="fill-sky-400/20"
        ></path>
        <path
          d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
          className="fill-sky-500"
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
          className="fill-sky-500"
        ></path>
      </svg>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
          className="fill-transparent"
        ></path>
        <path
          d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
          className={`fill-slate-400   ${
            theme === "dark" ? "fill-slate-500" : ""
          }`}
        ></path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
          className={`fill-slate-400   ${
            theme === "dark" ? "fill-slate-500" : ""
          }`}
        ></path>
      </svg>
    )}
  </>
);
const LightIcon = ({
  size = 22,
  width,
  height,
  strokeWidth = 2,
  theme,
  ...props
}) => (
  <>
    {theme === "light" ? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        className="w-5 h-5"
      >
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          className="fill-sky-400/20 stroke-sky-500"
        ></path>
        <path
          d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
          className="stroke-sky-500"
        ></path>
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
        className="w-5 h-5 "
        {...props}
      >
        <path
          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          className={`stroke-slate-400   ${
            theme === "dark" ? "stroke-slate-500" : ""
          }`}
        ></path>
        <path
          d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
          className={`stroke-slate-400   ${
            theme === "dark" ? "stroke-slate-500" : ""
          }`}
        ></path>
      </svg>
    )}
  </>
);
const SystemIcon = ({
  size = 22,
  width,
  height,
  strokeWidth = 2,
  theme,
  ...props
}) => (
  <>
    {theme === "system" ? (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" {...props}>
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
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" {...props}>
        <path
          d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className={`stroke-slate-400   ${
            theme === "system" ? "stroke-slate-50" : ""
          }`}
        ></path>
        <path
          d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          className={`stroke-slate-400   ${
            theme === "system" ? "stroke-slate-50" : ""
          }`}
        ></path>
      </svg>
    )}
  </>
);

export const ThemeIcon = ({ theme, item }) => {
  switch (item) {
    case "dark":
      return <DarkIcon theme={theme} />;
    case "light":
      return <LightIcon theme={theme} />;
    case "system":
      return <SystemIcon theme={theme} />;
    default:
      return null;
  }
};
