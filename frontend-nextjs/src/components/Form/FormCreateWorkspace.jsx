"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Textarea,
  Avatar,
  CircularProgress,
} from "@nextui-org/react";
import { useState } from "react";
import { CloseIcon } from "../Icon/CloseIcon";
import { createWorkspaceApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { toast } from "react-toastify";
const { updateWorkspace } = workspaceSlice.actions;
export default function FormCreateWorkspace({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isCreate, setIsCreate] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    color: "#9353D3",
  });
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
  const handleClick = () => {
    setIsOpen(true);
  };
  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const HandleCreateWorkspace = async (e) => {
    e.preventDefault();
    setIsCreate(true);
    createWorkspaceApi(user.id, {
      ...form,
    }).then((data) => {
      if (data.status === 200) {
        const workspace = data.data;
        toast.success("Tạo không gian mới thành công");
        dispatch(updateWorkspace(workspace));
        router.push(`/w/${workspace.id}/home`);

        setForm({ name: "", desc: "", color: "#9353D3" });
      }
      setIsCreate(false);
    });
  };
  const { name, desc, color } = form;
  return (
    <div className="">
      <Popover
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          setForm({ name: "", desc: "", color: "#9353D3" });
        }}
        placement="top-end"
        style={{
          top: "50%",
          left: "50%",
        }}
        backdrop="opaque"
        left={"50%"}
        classNames={{
          base: ["-translate-y-1/2 translate-x-1/2 "],
          content: [
            "py-3 px-4 border border-default-200 md:max-w-[550px] relative rounded-2xl",
          ],
        }}
      >
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
          {(titleProps) => (
            <div
              className="px-6 py-6 h-full w-full   overflow-x-auto"
              style={{ maxHeight: "calc(100vh - 80px)" }}
            >
              <button
                onClick={() => {
                  setIsOpen(false);
                  setForm({ name: "", desc: "", color: "#9353D3" });
                }}
                style={{
                  background: "rgb(247, 247, 247)",
                  color: "rgb(51, 51, 51)",
                  transition: "transform 150ms ease-in-out 0s;",
                }}
                className="rounded-full flex items-center justify-center w-[40px] h-[40px] p-0 absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 hover:scale-110  "
                type="button"
              >
                <CloseIcon size={20} />
              </button>
              <h2
                className="text-3xl font-normal w-full text-center"
                {...titleProps}
              >
                Tạo không gian làm việc
              </h2>

              <div className="w-full flex justify-center mt-4">
                <Avatar
                  radius="md"
                  size="sm"
                  style={{
                    background: `${color}`,
                  }}
                  className="h-[100px] w-[100px] text-white text-4xl rounded-full"
                  name={name.charAt(0).toUpperCase()}
                />
              </div>

              <form action="" className="mt-6" onSubmit={HandleCreateWorkspace}>
                <div>
                  <span className="block text-md uppercase font-medium text-default-400">
                    Màu Sắc
                  </span>
                  <div className="flex items-center w-full gap-1 mt-2   pb-4 flex-wrap">
                    {colors.map((color_item, index) => (
                      <div key={index}>
                        <Input
                          type="radio"
                          className="hidden"
                          name="color"
                          value={color_item}
                          id={color_item}
                          onChange={HandleChange}
                        />
                        <label
                          htmlFor={color_item}
                          className={`w-[36px] h-[36px] rounded-full border-0 border-solid ${
                            color_item === color ? "border-2" : ""
                          }   hover:border-2 border-black flex items-center justify-center`}
                          style={{ borderColor: `${color_item}` }}
                        >
                          <span
                            style={{ background: `${color_item}` }}
                            className="w-[28px] h-[28px] rounded-full  inline-block"
                          ></span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <Input
                  label={
                    <label htmlFor="name" className="text-default-400 text-lg">
                      Tên không gian làm việc
                    </label>
                  }
                  placeholder="Nhập tên không gian làm việc..."
                  type="name"
                  name="name"
                  variant={"bordered"}
                  labelPlacement="outside"
                  size="md"
                  isRequired
                  onChange={HandleChange}
                  value={name}
                />

                <Textarea
                  id="desc"
                  name="desc"
                  variant={"bordered"}
                  label={
                    <label htmlFor="desc" className="text-default-400 text-lg ">
                      Mô tả
                    </label>
                  }
                  labelPlacement="outside"
                  minRows={4}
                  className="col-span-12  md:col-span-6 mb-6 md:mb-0 w-full mt-3"
                  placeholder="Nhập mô tả..."
                  onChange={HandleChange}
                  value={desc}
                />
                <Button
                  isDisabled={isCreate ? true : false}
                  type="submit"
                  className="rounded-lg h-[52px] text-lg mt-4 w-full text lg font-medium text-white   flex items-center justify-center py-2"
                  style={{ background: "rgb(84, 196, 250)" }}
                >
                  {isCreate ? (
                    <CircularProgress aria-label="Loading..." size={22} />
                  ) : (
                    "Tạo mới"
                  )}
                </Button>
              </form>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
