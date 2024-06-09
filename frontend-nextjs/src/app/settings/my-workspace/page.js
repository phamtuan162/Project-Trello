"use client";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import FormCreateWorkspace from "@/components/Form/FormCreateWorkspace";
import { switchWorkspace } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { userSlice } from "@/stores/slices/userSlice";
import { fetchMission } from "@/stores/middleware/fetchMission";
const { updateWorkspace } = workspaceSlice.actions;
const { updateUser } = userSlice.actions;
const PageMyWorkspace = () => {
  const dispatch = useDispatch();
  const { id: workspaceId } = useParams();
  const router = useRouter();
  const user = useSelector((state) => state.user.user);

  const workspace = useSelector((state) => state.workspace.workspace);

  const my_workspaces = useMemo(() => {
    return (
      user?.workspaces?.filter((item) => item.role.toLowerCase() === "owner") ||
      []
    );
  }, [user]);

  const handleSwitchWorkspace = async (workspace_id_witched) => {
    console.log(workspaceId);
    if (+workspace_id_witched === +workspace.id) {
      toast.info("Bạn đang ở Không gian làm việc này!");
      return;
    }
    try {
      const data = await switchWorkspace(workspace_id_witched, {
        user_id: user.id,
      });
      if (data.status === 200) {
        const workspaceActive = data.data;
        if (workspaceActive.users) {
          const userNeedToFind = workspaceActive.users.find(
            (item) => +item.id === +user.id
          );
          dispatch(updateUser({ ...user, role: userNeedToFind.role }));
        }
        dispatch(
          fetchMission({
            user_id: user.id,
            workspace_id: workspace_id_witched,
          })
        );
        dispatch(updateWorkspace(workspaceActive));
        router.push(`/w/${workspaceActive.id}/home`);
      }
    } catch (error) {
      console.error("Không thể chuyển đổi không gian làm việc", error);
    }
  };
  return (
    <div className="mt-2">
      <h1 className="text-2xl font-medium">Không gian làm việc của tôi</h1>
      <p className="mt-1">
        Các không gian làm việc do bạn tạo ra là nơi bạn có thể quản lý dự án,
        cộng tác với đồng đội, và theo dõi tiến độ công việc. Bạn có thể tạo
        bảng, thêm thẻ, và gán nhiệm vụ cho các thành viên trong nhóm để đảm bảo
        mọi thứ diễn ra suôn sẻ và hiệu quả.
      </p>

      <div className="flex  gap-4 mt-8 flex-wrap">
        {my_workspaces?.map((workspace) => (
          <div className="flex flex-col gap-3 items-center w-[200px]">
            <div
              onClick={() => handleSwitchWorkspace(workspace.id)}
              key={workspace.id}
              className=" cursor-pointer rounded-full w-[180px] h-[180px] group relative  bg-center  bg-cover bg-sky-700   p-2 overflow-hidden flex items-center justify-center"
              style={{
                background: `${
                  workspace && workspace.color ? workspace.color : "#9353D3"
                }`,
              }}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
              <p className="relative font-semibold text-white text-6xl">
                {workspace?.name?.charAt(0)}
              </p>
            </div>
            <p className="w-full text-center">{workspace.name}</p>
          </div>
        ))}

        <FormCreateWorkspace>
          <div
            role="button"
            className="aspect-video relative  w-[180px] h-[180px] ml-[20px] bg-muted rounded-full flex bg-default-300 flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <Plus size={60} />
          </div>
        </FormCreateWorkspace>
      </div>
    </div>
  );
};
export default PageMyWorkspace;
