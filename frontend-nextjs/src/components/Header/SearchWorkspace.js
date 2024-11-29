"use client";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Avatar } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import Loading from "../Loading/Loading";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
import { SearchIcon } from "../Icon/SearchIcon";
import { switchWorkspaceApi } from "@/services/workspaceApi";
import { userSlice } from "@/stores/slices/userSlice";
import { fetchMission } from "@/stores/middleware/fetchMission";
import { fetchWorkspace } from "@/stores/middleware/fetchWorkspace";

const { updateUser } = userSlice.actions;

const SearchWorkspace = ({ isLoading, setIsLoading }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);

  const workspaces = useMemo(() => {
    return user?.workspaces?.filter((w) => !w.deleted_at) || [];
  }, [user?.workspaces]);

  const filteredItems = useMemo(() => {
    let filteredWorkspaces = workspaces.filter(
      (item) => item?.id && +item.id !== +workspace.id
    );

    if (hasSearchFilter) {
      filteredWorkspaces = filteredWorkspaces.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredWorkspaces;
  }, [workspaces, filterValue]);

  const handleSwitchWorkspace = async (workspaceSwitch) => {
    const { id, role } = workspaceSwitch;

    setIsLoading(true);
    try {
      await toast
        .promise(
          async () =>
            await switchWorkspaceApi(id, {
              user_id: user.id,
            }),
          { pending: "Đang di chuyển..." }
        )
        .then(async (res) => {
          await Promise.all([
            // Cập nhật role và workspace_id_active user
            dispatch(
              updateUser({
                role: role,
                workspace_id_active: id,
              })
            ),
            // Chờ fetchWorkspace và fetchMission hoàn thành trước khi chuyển trang
            dispatch(fetchWorkspace(id)),
            dispatch(
              fetchMission({
                user_id: user.id,
                workspace_id: id,
              })
            ),
          ]);

          // Chuyển hướng sau khi các dữ liệu đã được tải về
          router.push(`/w/${id}/home`);
          toast.success("Chuyển không gian làm việc thành công");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setFilterValue("");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  if (isLoading) {
    return <Loading backgroundColor={"white"} zIndex={"1000"} />;
  }

  return (
    <div className=" sm:w-[300px] w-[240px] hidden sm:inline-block  relative">
      <Input
        variant="bordered"
        isRequired
        name="keyword"
        id="keyword"
        classNames={{
          base: "w-full ml-auto",
          mainWrapper: "h-full",
          input: "text-small ",
          inputWrapper:
            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20 rounded-lg",
        }}
        placeholder="Tìm kiếm..."
        size="sm"
        type="search"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        startContent={<SearchIcon size={18} />}
      />
      {hasSearchFilter && (
        <div
          className={`absolute bg-white p-3 rounded-lg left-0 right-0 text-xs top-full translate-y-2 `}
          style={{
            boxShadow: "0px 8px 12px #091E4226, 0px 0px 1px #091E424F",
          }}
        >
          <span className="italic text-md p-2 hidden last:block   text-center text-muted-foreground">
            Không tìm thấy
          </span>
          {filteredItems?.map((item) => (
            <div
              onClick={() => handleSwitchWorkspace(item)}
              key={item.id}
              className="flex gap-3 interceptor-loading p-1.5 hover:bg-default-100 rounded-lg pointer select-none list-none items-center "
              style={{ cursor: "pointer" }}
            >
              <Avatar
                radius="md"
                size="sm"
                style={{
                  background: `${item && item.color ? item.color : "#9353D3"}`,
                }}
                className="h-9 w-9 text-white "
                name={item?.name?.charAt(0)}
              />
              <div className="grow flex flex-col items-start  gap-1">
                <h4 className="w-full max-w-[169px] text-xs leading-4 text-small font-semibold leading-none text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                  {item?.name}
                </h4>
                <div className="flex items-center text-xs text-muted-foreground ">
                  <PrivateIcon size={16} /> {"\u2022"} {item?.total_user} thành
                  viên
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default SearchWorkspace;
