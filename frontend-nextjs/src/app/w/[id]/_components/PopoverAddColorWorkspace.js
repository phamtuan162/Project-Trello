"use client";
import {
  Input,
  Avatar,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { updateWorkspaceApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { userSlice } from "@/stores/slices/userSlice";

const { updateWorkspace } = workspaceSlice.actions;

const { updateUser } = userSlice.actions;

const PopoverAddColorWorkspace = ({ workspace }) => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
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
    "#fbdba7",
  ];

  const [colorWorkspace, setColorWorkspace] = useState("");

  useEffect(() => {
    if (workspace.color) {
      setColorWorkspace(workspace.color);
    }
  }, [workspace]);

  const addColorWorkspace = async () => {
    try {
      const { data, status, message } = await updateWorkspaceApi(workspace.id, {
        color: colorWorkspace,
      });

      if (status >= 200 && status <= 299) {
        dispatch(updateWorkspace({ ...workspace, color: colorWorkspace }));

        const updatedWorkspaces = user.workspaces.map((ws) =>
          ws.id === workspace.id ? { ...ws, color: colorWorkspace } : ws
        );

        dispatch(updateUser({ ...user, workspaces: updatedWorkspaces }));

        toast.success("Thêm màu không gian làm việc thành công");
      } else {
        console.log(message);
      }
    } catch (error) {
      console.log("Error updating workspace color:", error);
    }
  };

  return (
    <Popover placement="bottom" className="w-max-[248px]">
      <PopoverTrigger>
        <div className="w-[48px] h-full relative cursor-pointer">
          <Avatar
            alt="Workspace"
            radius="md"
            style={{
              background: `${
                workspace && workspace.color ? workspace.color : "bg-indigo-100"
              }`,
            }}
            className="w-full h-full text-lg text-white   object-cover"
            name={workspace?.name?.charAt(0).toUpperCase()}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[248px]">
        <div className=" rounded-lg p-3 w-[248px]">
          <span className="block text-md uppercase font-medium text-default-400">
            Màu không gian làm việc
          </span>
          <div className="flex items-center w-full  mt-3 flex-wrap">
            {colors.map((color, index) => (
              <div key={index}>
                <Input
                  type="radio"
                  className="hidden"
                  name="color-workspace"
                  value={color}
                  id={color}
                  onChange={(e) => setColorWorkspace(e.target.value)}
                />
                <label
                  htmlFor={color}
                  name="color-workspace"
                  className={`w-[28px] h-[28px] rounded-full border-0 border-solid ${
                    color === colorWorkspace ? "border-2" : ""
                  }   hover:border-2 border-black flex items-center justify-center`}
                  style={{ borderColor: `${color}` }}
                >
                  <span
                    style={{ background: `${color}` }}
                    className="w-[20px] h-[20px] rounded-full  inline-block"
                  ></span>
                </label>
              </div>
            ))}
          </div>

          <Button
            onClick={addColorWorkspace}
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
