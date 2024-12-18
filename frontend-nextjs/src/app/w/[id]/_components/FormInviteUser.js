"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Avatar,
  User,
  CircularProgress,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { useDebounceFn } from "@/hooks/useDebounce";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { Message } from "@/components/Message/Message";
import { inviteUserApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { userSlice } from "@/stores/slices/userSlice";
import { searchUser } from "@/services/userApi";
import { socket } from "@/socket";

const { inviteUserInWorkspace, updateActivitiesInWorkspace } =
  workspaceSlice.actions;
const { updateWorkspaceInUser } = userSlice.actions;

const FormInviteUser = ({ rolesUser }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isInvite, setIsInvite] = useState(false);
  const [role, setRole] = useState(new Set(["member"]));
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [keyWord, setKeyWord] = useState("");

  const [usersSearch, setUsersSearch] = useState([]);
  const [userInvite, setUserInvite] = useState(null);
  const [message, setMessage] = useState(
    `Không gian làm việc tối đa 10 người. Không gian làm việc hiện tại có ${
      workspace.users ? workspace.users.length : "1"
    } người `
  );

  const isAdminOrOwner = useMemo(() => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const handleSearchUser = async (keyword) => {
    if (keyword.length <= 2 || userInvite) {
      setIsSearch(false);
      setUsersSearch([]);
      return;
    }

    try {
      setIsLoading(true);
      setIsSearch(true);

      const { data: usersSearch } = await searchUser({
        keyword: keyword,
        limit: 4,
      });

      setUsersSearch(usersSearch || []);
    } catch (error) {
      console.log(error);
      setUsersSearch([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debounceSearchUser = useDebounceFn(handleSearchUser, 1000);

  useEffect(() => {
    debounceSearchUser(keyWord);
  }, [keyWord]);

  const handleInviteUser = async (e) => {
    e.preventDefault();

    if (!userInvite) return;

    try {
      const isUserInvited = workspace?.users?.some(
        (user) => user.id === userInvite.id
      );

      if (isUserInvited) {
        setMessage("Người dùng này đã có trong Không gian làm việc của bạn");
        return;
      }

      const selectedRole = [...role][0];

      await toast
        .promise(
          async () =>
            await inviteUserApi({
              user_id: userInvite.id,
              role: selectedRole,
              workspace_id: workspace.id,
            }),
          { pending: "Đang thêm ..." }
        )
        .then((res) => {
          const { activity, notification } = res;
          dispatch(
            inviteUserInWorkspace({ ...userInvite, role: selectedRole })
          );
          dispatch(updateActivitiesInWorkspace(activity));
          dispatch(
            updateWorkspaceInUser({
              id: workspace.id,
              total_user: +workspace.users.length + 1,
            })
          );

          socket.emit("sendNotification", {
            user_id: userInvite.id,
            notification,
          });

          socket.emit("inviteUser", {
            userInvite: {
              id: user.id,
              workspace_id_active: user.workspace_id_active,
            },
            userInvited: { ...userInvite, role: selectedRole },
          });

          toast.success("Mời người dùng vào Không gian làm việc thành công");

          resetForm();
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectUserInvite = (userSelected) => {
    setUserInvite(userSelected);
    setKeyWord(userSelected.name);
    setIsSearch(false);
  };

  const resetForm = () => {
    setIsInvite(false);
    setIsSearch(false);
    setUserInvite(null);
    setUsersSearch([]);
    setKeyWord("");
    setRole(new Set(["member"]));
    setMessage(
      `Không gian làm việc tối đa 10 người. Không gian làm việc hiện tại có ${
        workspace.users ? workspace.users.length : "1"
      } người`
    );
  };

  return (
    <div>
      <Button
        isDisabled={!isAdminOrOwner}
        onClick={() => setIsInvite(true)}
        style={{ background: "#7f77f1" }}
        size="sm"
        className="w-[100px] text-white text-sm"
      >
        Mời
      </Button>
      {isInvite && (
        <div className="fixed inset-0 z-50">
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-overlay/50 z-50"
          ></div>
          <div
            style={{ zIndex: "51" }}
            className="w-3/4 md:w-[600px] absolute top-1/2 left-1/2 bg-white p-8 px-8 rounded-2xl -translate-y-1/2 -translate-x-1/2"
          >
            <div className="flex flex-col items-center relative">
              <button
                onClick={resetForm}
                className="absolute -top-6 -right-6 w-[24px] h-[24px] flex items-center justify-center hover:bg-default-200 rounded-lg"
              >
                <CloseIcon size={18} />
              </button>
              <h2 className="text-xl font-medium w-full text-center mb-3">
                Mời vào Không gian làm việc
              </h2>
              <Message message={message} />
              <form
                className="flex w-full gap-2 mt-4"
                onSubmit={handleInviteUser}
              >
                <div className="grow relative">
                  <Input
                    variant="bordered"
                    type="search"
                    isRequired
                    name="keyword"
                    id="keyword"
                    placeholder="Nhập tên hoặc email..."
                    className="text-sm rounded-md focus-visible:outline-0 w-full"
                    size="xs"
                    isDisabled={userInvite}
                    onChange={(e) => setKeyWord(e.target.value)}
                    value={keyWord}
                    startContent={
                      userInvite && (
                        <Avatar
                          color="secondary"
                          alt={userInvite.name}
                          name={userInvite.name.charAt(0).toUpperCase()}
                          size="sm"
                          className="w-[34px] h-[28px]"
                          src={userInvite.avatar}
                        />
                      )
                    }
                    endContent={
                      userInvite && (
                        <button
                          type="button"
                          className="p-1 rounded-lg hover:bg-default-300 cursor-pointer"
                          onClick={() => {
                            setUserInvite(null);
                            setKeyWord("");
                            setRole(new Set(["member"]));
                          }}
                        >
                          <CloseIcon size={16} />
                        </button>
                      )
                    }
                  />
                  {isSearch && (
                    <div
                      className={`absolute max-h-[180px] empty:hidden overflow-x-auto bg-white p-2 rounded-lg left-0 right-0 text-xs top-full translate-y-2 ${
                        isLoading ? "flex items-center justify-center " : ""
                      }`}
                      style={{
                        boxShadow:
                          "0px 8px 12px #091E4226, 0px 0px 1px #091E424F",
                      }}
                    >
                      <p className="hidden last:block text-xs  text-center text-muted-foreground">
                        Không tìm thấy người dùng nào
                      </p>

                      {isLoading ? (
                        <CircularProgress size={18} />
                      ) : (
                        usersSearch?.map((userSearch) => (
                          <div
                            key={userSearch.id}
                            className="mt-2 hover:bg-default-300 rounded-lg p-1 px-3 cursor-pointer"
                            onClick={() => handleSelectUserInvite(userSearch)}
                          >
                            <User
                              avatarProps={{
                                radius: "full",
                                size: "sm",
                                src: userSearch.avatar,
                                color: "secondary",
                                name: userSearch.name.charAt(0).toUpperCase(),
                              }}
                              classNames={{ description: "text-default-500" }}
                              description={userSearch.email}
                              name={userSearch.name}
                            >
                              {userSearch.email}
                            </User>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                {userInvite && (
                  <div className="flex gap-2">
                    <Select
                      variant="bordered"
                      size="xs"
                      aria-label="Roles"
                      classNames={{
                        label: "group-data-[filled=true]:-translate-y-5",
                        trigger: "w-[120px]",
                      }}
                      selectedKeys={role}
                      onSelectionChange={setRole}
                    >
                      {rolesUser.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Button
                      type="submit"
                      color="primary"
                      className="text-sm interceptor-loading"
                    >
                      Thêm
                    </Button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormInviteUser;
