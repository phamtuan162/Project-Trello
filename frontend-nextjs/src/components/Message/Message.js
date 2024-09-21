import { WarningIcon } from "../Icon/WarningIcon";
import { Check } from "lucide-react";
export const Message = ({ message, type = "warning" }) => {
  return message ? (
    <div
      style={{
        background: `${
          type === "success" ? "rgb(236 250 220)" : "rgb(255, 250, 230)"
        }`,
      }}
      className="w-full p-2 flex gap-4  items-center  px-4"
    >
      {type === "success" ? (
        <>
          <div className="shrink">
            <Check size={20} color={"green"} fill={"#FFFAE6"} />
          </div>
          <span
            style={{
              color: "rgb(94, 108, 132)",
            }}
            className=" text-sm "
          >
            {message}
          </span>
        </>
      ) : (
        <>
          <div className="shrink">
            <WarningIcon
              color={"#FF8B00"}
              fill={"#FFFAE6"}
              width="20"
              height="20"
            />
          </div>
          <span
            style={{
              color: "rgb(94, 108, 132)",
            }}
            className=" text-sm "
          >
            {message}
          </span>
        </>
      )}
    </div>
  ) : (
    ""
  );
};
