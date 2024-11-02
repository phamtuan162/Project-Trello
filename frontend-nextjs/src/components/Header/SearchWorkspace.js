"use client";
import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input, Avatar, CircularProgress } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
import { SearchIcon } from "../Icon/SearchIcon";
import { switchWorkspace } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { userSlice } from "@/stores/slices/userSlice";
import { fetchMission } from "@/stores/middleware/fetchMission";
import { toast } from "react-toastify";
const { updateWorkspace } = workspaceSlice.actions;
const { updateUser } = userSlice.actions;
const SearchWorkspace = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);

  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredWorkspaces =
      user?.workspaces?.filter((item) => item !== null && item !== undefined) ||
      [];

    if (hasSearchFilter) {
      filteredWorkspaces = filteredWorkspaces.filter((item) =>
        item.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredWorkspaces;
  }, [user, filterValue]);

  const handleSwitchWorkspace = async (workspace_id_witched) => {
    if (+workspace_id_witched === +workspace.id) {
      toast.info("Đang ở Không gian làm việc này");
      return;
    }
    setIsLoading(true);
    try {
      const { data, status } = await switchWorkspace(workspace_id_witched, {
        user_id: user.id,
      });
      if (200 <= status && status <= 299) {
        const workspaceActive = data;
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
      console.log(error);
    } finally {
      setFilterValue("");
      setIsLoading(false);
    }
  };

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
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    onClick={() => handleSwitchWorkspace(item.id)}
                    key={item.id}
                    className="flex gap-3  p-1.5 hover:bg-default-100 rounded-lg pointer select-none list-none items-center "
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar
                      radius="md"
                      size="sm"
                      style={{
                        background: `${
                          item && item.color ? item.color : "#9353D3"
                        }`,
                      }}
                      className="h-9 w-9 text-white "
                      name={item?.name?.charAt(0)}
                    />
                    <div className="grow flex flex-col items-start  gap-1">
                      <h4 className="w-full max-w-[169px] text-xs leading-4 text-small font-semibold leading-none text-default-600 overflow-hidden whitespace-nowrap text-ellipsis rounded-lg">
                        {item?.name}
                      </h4>
                      <div className="flex items-center text-xs text-muted-foreground ">
                        <PrivateIcon size={16} /> {"\u2022"} {item?.total_user}{" "}
                        thành viên
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <span className="italic text-md p-2">Không tìm thấy</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default SearchWorkspace;
