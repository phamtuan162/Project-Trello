import { WarningIcon } from "../Icon/WarningIcon";
import { Check } from "lucide-react";

const messageStyles = {
  success: {
    background: "rgb(236 250 220)",
    icon: Check,
    color: "green",
  },
  warning: {
    background: "rgb(255, 250, 230)",
    icon: WarningIcon,
    color: "#FF8B00",
  },
};

export const Message = ({ message, type = "warning" }) => {
  if (!message) return null;

  const {
    background,
    icon: IconComponent,
    color,
  } = messageStyles[type] || messageStyles.warning;

  return (
    <div
      style={{ background }}
      className="w-full p-2 flex gap-4 items-center px-4"
    >
      <div className="shrink">
        <IconComponent size={20} color={color} fill={"#FFFAE6"} />
      </div>
      <span style={{ color: "rgb(94, 108, 132)" }} className="text-sm">
        {message}
      </span>
    </div>
  );
};
