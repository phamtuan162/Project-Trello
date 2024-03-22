import {
  Input,
  Avatar,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
const PopoverAddColorWorkspace = ({ workspace }) => {
  const addColorWorkspace = async (e) => {};
  const colors = [
    "#338EF7",
    "#9353D3",
    "#45D483",
    "#F54180",
    "#FF71D7",
    "#F7B750",
    "#A5EEFD",
    "#0E793C",
    "#004493",
    "#C20E4D",
    "#936316",
  ];
  return (
    <Popover placement="bottom" className="w-max-[248px]">
      <PopoverTrigger>
        <div className="w-[48px] h-full relative cursor-pointer">
          <Avatar
            alt="Workspace"
            src={workspace?.avatar}
            radius="md"
            className="w-full h-full text-lg text-indigo-700 bg-indigo-100  object-cover"
            name={workspace?.name?.charAt(0).toUpperCase()}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[248px]">
        <div className=" rounded-lg p-3 w-[248px]">
          <span className="block text-md uppercase font-medium text-default-400">
            Màu không gian làm việc
          </span>
          <div className="flex items-center w-full gap-2 mt-3 flex-wrap">
            {colors.map((color, index) => (
              <>
                <Input
                  key={index}
                  type="radio"
                  className="hidden"
                  name="color-workspace"
                  value={color}
                  id={color}
                />
                <label
                  htmlFor={color}
                  name="color-workspace"
                  className={`w-[20px] h-[20px] rounded-full  inline-block`}
                  style={{ background: `${color}` }}
                ></label>
              </>
            ))}
          </div>

          <Button
            type="button"
            className="rounded-lg h-[40px] mt-4 w-full flex items-center justify-center border-1 border-solid border-secondary-400 bg-white text-secondary-400 hover:bg-secondary-400 hover:text-white"
          >
            Thêm màu
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default PopoverAddColorWorkspace;
