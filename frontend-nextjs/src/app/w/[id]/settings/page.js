"use client";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import {
  Input,
  Avatar,
  Textarea,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Link,
} from "@nextui-org/react";
import { updateWorkspaceApi } from "@/services/workspaceApi";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/Loading/Loading";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import FormDeleteWorkspace from "../_components/FormDeleteWorkspace";
const { updateWorkspace } = workspaceSlice.actions;
export default function pageWorkspaceSetting() {
  const dispatch = useDispatch();
  const { id: workspaceId } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const user = useSelector((state) => state.user.user);
  const descRef = useRef(null);

  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );
  const [form, setForm] = useState({
    name: "",
    desc: "",
  });

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateWorkspace = async (formData) => {
    const name = formData.get("name");
    const desc = formData.get("desc");
    updateWorkspaceApi(workspaceId, {
      name: name,
      desc: desc,
    }).then((data) => {
      if (data.status === 200) {
        const workspacesUpdate = workspaces.map((workspace) => {
          if (workspace.id === workspaceId) {
            return {
              ...workspace,
              name: name,
              desc: desc,
            };
          }
          return workspace;
        });
        dispatch(updateWorkspace(workspacesUpdate));
        toast.success("Cập nhật thành công");
      }
    });
  };

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
  const { name, desc } = form;
  return workspace ? (
    <div className="pb-6">
      <div className="border-b-1 border-solid border-default-400 w-full pb-6 mt-4">
        <span className=" uppercase text-default-400 font-normal text-sm">
          Kế hoạch
        </span>
        <h2 className="text-xl font-medium mt-3 ">Gói miễn phí</h2>
        <p className="mt-1 max-w-[500px]">
          Khám phá những lợi ích của
          <Link style={{ color: "rgb(249, 214, 0)" }} className="mx-1">
            Gói cao cấp tất cả trong một của chúng tôi
          </Link>
        </p>
      </div>

      <form className="xl:w-1/2 w-2/3 mt-6 pb-8" action={handleUpdateWorkspace}>
        <h2 className="text-2xl font-medium">Cập nhật không gian làm việc</h2>

        <div className="flex items-center gap-4 mt-6 h-[48px] ">
          <div className="w-[48px] h-full relative cursor-pointer">
            <Popover placement="bottom" className="w-max-[248px]">
              <PopoverTrigger>
                <Avatar
                  fill
                  alt="Workspace"
                  src={workspace?.avatar}
                  radius="md"
                  className="w-full h-full text-lg text-indigo-700 bg-indigo-100  object-cover"
                  name={workspace?.name?.charAt(0).toUpperCase()}
                />
              </PopoverTrigger>
              <PopoverContent className="w-[248px]">
                <div className=" rounded-lg p-3 w-[248px]">
                  <span className="block text-md uppercase font-medium text-default-400">
                    Màu không gian làm việc
                  </span>
                  <div className="flex items-center w-full gap-2 mt-3 flex-wrap">
                    {colors.map((color) => (
                      <>
                        <Input
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
          </div>

          <input
            isRequired
            type="name"
            name="name"
            className="h-full b-0 grow border-b-1 border-default-200 border-solid focus-visible:outline-none"
            onChange={HandleChange}
            defaultValue={workspace?.name}
          />
        </div>
        <Textarea
          ref={descRef}
          id="desc"
          name="desc"
          variant={"bordered"}
          label={
            <label htmlFor="desc" className="text-default-400 text-md ">
              Mô tả
            </label>
          }
          labelPlacement="outside"
          minRows={8}
          className="col-span-12  md:col-span-6 mb-6 md:mb-0 w-full mt-3"
          placeholder="Nhập mô tả..."
          defaultValue={workspace?.desc}
          onChange={HandleChange}
        />

        <Button
          type="submit"
          color="secondary-300"
          className="rounded-lg w-[140px] h-[44px] mt-4 flex items-center justify-center text-md "
        >
          Lưu
        </Button>
      </form>
      <FormDeleteWorkspace workspace={workspace} />
    </div>
  ) : (
    <Loading backgroundColor={"white"} zIndex={"100"} />
  );
}
