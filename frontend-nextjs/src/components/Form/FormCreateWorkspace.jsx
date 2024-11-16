"use client";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Textarea,
  Avatar,
  CircularProgress,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
} from "@nextui-org/react";
import { useState } from "react";
import { createWorkspaceApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { toast } from "react-toastify";
import { userSlice } from "@/stores/slices/userSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
const { updateUser } = userSlice.actions;
const { updateWorkspace } = workspaceSlice.actions;
const { updateMission } = missionSlice.actions;
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
export default function FormCreateWorkspace({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [form, setForm] = useState({
    name: "",
    desc: "",
    color: colors[1],
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!name || !desc) {
      return;
    }

    try {
      await toast
        .promise(async () => await createWorkspaceApi(user.id, form), {
          pending: "Đang tạo...",
          error: "Tạo mới thất bại!",
        })
        .then((res) => {
          const { data } = res;

          dispatch(updateUser({ role: "owner" }));
          dispatch(updateWorkspace(data));
          dispatch(updateMission([]));
          toast.success("Tạo không gian mới thành công");
          router.push(`/w/${data.id}/home`);
          onClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } finally {
      setForm({ name: "", desc: "", color: colors[1] });
    }
  };

  const resetForm = () => {
    setForm({ name: "", desc: "", color: colors[1] });
  };

  const { name, desc, color } = form;
  return (
    <div className="">
      <div onClick={onOpen}>{children}</div>

      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
        isDismissable={false}
        onClose={() => resetForm()}
        backdrop="opaque"
      >
        <ModalContent className="max-w-xl  self-start z-50">
          {(onClose) => (
            <div className="px-6 py-6 h-full w-full  ">
              <h2 className="text-3xl font-normal w-full text-center">
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
              <ModalBody>
                <form
                  action=""
                  className="mt-6"
                  onSubmit={handleCreateWorkspace}
                >
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
                            onChange={handleChange}
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
                      <label
                        htmlFor="name"
                        className="text-default-400 text-lg"
                      >
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
                    onChange={handleChange}
                    value={name}
                  />

                  <Textarea
                    id="desc"
                    name="desc"
                    variant={"bordered"}
                    label={
                      <label
                        htmlFor="desc"
                        className="text-default-400 text-lg "
                      >
                        Mô tả
                      </label>
                    }
                    labelPlacement="outside"
                    minRows={4}
                    className="col-span-12  md:col-span-6 mb-6 md:mb-0 w-full mt-3"
                    placeholder="Nhập mô tả..."
                    onChange={handleChange}
                    value={desc}
                  />
                  <Button
                    type="submit"
                    className="rounded-lg interceptor-loading h-[52px] text-lg mt-4 w-full text lg font-medium text-white   flex items-center justify-center py-2"
                    style={{ background: "rgb(84, 196, 250)" }}
                  >
                    Tạo mới
                  </Button>
                </form>
              </ModalBody>
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
