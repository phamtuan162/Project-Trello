"use client";
import { useDispatch } from "react-redux";
import { Textarea, Button } from "@nextui-org/react";
import { updateWorkspaceApi } from "@/services/workspaceApi";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import PopoverAddColorWorkspace from "./PopoverAddColorWorkspace";
const { updateWorkspace } = workspaceSlice.actions;
const FormUpdateWorkspace = ({ workspace }) => {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: "",
    desc: "",
  });
  useEffect(() => {
    if (workspace.id) {
      setForm({
        name: workspace.name,
        desc: workspace.desc,
      });
    }
  }, [workspace]);

  const HandleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateWorkspace = async (formData) => {
    const name = formData.get("name");
    const desc = formData.get("desc");
    updateWorkspaceApi(workspace.id, {
      name: name,
      desc: desc,
    }).then((data) => {
      if (data.status === 200) {
        dispatch(updateWorkspace({ ...workspace, name: name, desc: desc }));
        toast.success("Cập nhật thành công");
      }
    });
  };

  const { name, desc } = form;
  return (
    <form className="xl:w-1/2 w-2/3 mt-6 pb-8" action={handleUpdateWorkspace}>
      <h2 className="text-2xl font-medium">Cập nhật không gian làm việc</h2>

      <div className="flex items-center gap-4 mt-6 h-[48px] ">
        <PopoverAddColorWorkspace workspace={workspace} />

        <input
          type="text"
          name="name"
          className="h-full b-0 grow border-b-1 border-default-200 border-solid focus-visible:outline-none"
          onChange={HandleChange}
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
        onChange={HandleChange}
      />

      <Button
        type="submit"
        className="rounded-lg w-[140px] h-[44px] mt-4 flex items-center justify-center text-md bg-violet-400	"
      >
        Lưu
      </Button>
    </form>
  );
};
export default FormUpdateWorkspace;
