"use client";
import { useDispatch, useSelector } from "react-redux";
import { Textarea, Button } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isEqual } from "lodash";
import { updateWorkspaceApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import PopoverAddColorWorkspace from "./PopoverAddColorWorkspace";

const { updateWorkspace } = workspaceSlice.actions;

const FormUpdateWorkspace = ({ workspace }) => {
  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const user = useSelector((state) => state.user.user);
  const [form, setForm] = useState({
    name: workspace?.name || "",
    desc: workspace?.desc || "",
    isChange: false,
    // Thêm các thuộc tính khác nếu cần
  });

  useEffect(() => {
    if (workspace) {
      const newForm = {
        name: workspace.name,
        desc: workspace.desc,
        isChange: false,
        // Thêm các thuộc tính khác nếu cần
      };

      if (!form.isChange && !isEqual(form, newForm)) {
        setForm(newForm);
      }
    }
  }, [workspace]);

  const handleChange = (e) => {
    setForm({
      ...form,
      isChange: true,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateWorkspace = async (formData) => {
    const name = formData.get("name");
    const desc = formData.get("desc");

    if (name === workspace.name && desc === workspace.desc) return;

    try {
      const data = await updateWorkspaceApi(workspace.id, { name, desc });

      if (data.status === 200) {
        dispatch(updateWorkspace({ ...workspace, name, desc }));
        toast.success("Cập nhật thành công");
        socket.emit("updateWorkspace", {
          userActionId: user.id,
          workspace_id: workspace.id,
        });
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
      setForm({ name: workspace.name, desc: workspace.desc, isChange: false });
    }
  };

  const handleReset = () => {
    setForm({
      name: workspace.name,
      desc: workspace.desc,
      isChange: false,
    });
  };

  const { name, desc, isChange } = form;

  return (
    <form className="xl:w-1/2 w-2/3 mt-6 pb-8" action={handleUpdateWorkspace}>
      <h2 className="text-2xl font-medium">Cập nhật không gian làm việc</h2>

      <div className="flex items-center gap-4 mt-6 h-[48px] ">
        <PopoverAddColorWorkspace workspace={workspace} />

        <input
          type="text"
          name="name"
          className="h-full b-0 grow border-b-1 border-default-200 border-solid focus-visible:outline-none"
          onChange={handleChange}
          value={name}
        />
      </div>
      <Textarea
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
        value={desc}
        onChange={handleChange}
      />

      <div className="flex gap-4">
        <Button
          isDisabled={name === ""}
          type="submit"
          className="rounded-lg w-[140px] h-[44px] mt-4 flex items-center justify-center text-md bg-violet-400 text-white"
        >
          Lưu
        </Button>
        {isChange && (
          <Button
            type="button"
            className="rounded-lg w-[140px] h-[44px] mt-4 flex items-center justify-center text-md bg-gray-400 text-white"
            onClick={handleReset}
          >
            Làm mới
          </Button>
        )}
      </div>
    </form>
  );
};
export default FormUpdateWorkspace;
