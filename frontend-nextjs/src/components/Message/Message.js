import { WarningIcon } from "../Icon/WarningIcon";
export const Message = ({ message, type }) => {
  return message ? (
    <div
      style={{ background: "rgb(255, 250, 230)" }}
      className="w-full p-2 flex gap-4  items-center  px-4"
    >
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
    </div>
  ) : (
    ""
  );
};
