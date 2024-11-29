"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
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

import { debounce } from "@/utils/debounce";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { Message } from "@/components/Message/Message";
import { inviteUserApi } from "@/services/workspaceApi";
import { workspaceSlice } from "@/stores/slices/workspaceSlice";
import { searchUser } from "@/services/userApi";

const { inviteUserInWorkspace, updateActivitiesInWorkspace } =
  workspaceSlice.actions;

const FormInviteUser = ({ rolesUser }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const socket = useSelector((state) => state.socket.socket);
  const workspace = useSelector((state) => state.workspace.workspace);
  const [isInvite, setIsInvite] = useState(false);
  const [role, setRole] = useState(new Set(["member"]));
  const [isSearch, setIsSearch] = useState(false);
  const [searchResultsValid, setSearchResultsValid] = useState(true);
  const [searchError, setSearchError] = useState(false); // Trạng thái lỗi tìm kiếm
  const [isLoading, setIsLoading] = useState(false);
  const [usersSearch, setUsersSearch] = useState([]);
  const [userInvite, setUserInvite] = useState(null);
  const [keyword, setKeyWord] = useState("");
  const [message, setMessage] = useState(
    `Không gian làm việc tối đa 10 người. Không gian làm việc hiện tại có ${
      workspace.users ? workspace.users.length : "1"
    } người `
  );

  const isAdminOrOwner = useMemo(() => {
    if (!user) return false;
    const role = user.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user.role]);

  const handleSearchUser = useCallback(
    debounce(async (inputKeyword) => {
      setIsLoading(true);
      setSearchError(false); // Reset lỗi tìm kiếm
      try {
        const { data, status } = await searchUser({
          keyword: inputKeyword,
          limit: 4,
        });
        if (200 <= status && status <= 299) {
          const users = data;
          setUsersSearch(users);
          setSearchResultsValid(users.length > 0);
        } else {
          setUsersSearch([]);
          setSearchResultsValid(false);
        }
      } catch (error) {
        setSearchError(true);
        console.log("Search error:", error);
      }
      setIsLoading(false);
    }, 2000),
    []
  );

  useEffect(() => {
    return () => {
      handleSearchUser.cancel(); // Hủy bỏ debounce nếu component unmount
    };
  }, [handleSearchUser]);

  const handleInputChange = useCallback((e) => {
    const inputKeyword = e.target.value.trim();
    setKeyWord(inputKeyword);

    if (inputKeyword.length >= 2) {
      setIsSearch(true);
      handleSearchUser(inputKeyword);
    } else {
      setIsSearch(false);
      setUsersSearch([]);
      setSearchResultsValid(true);
      setSearchError(false);
    }
  }, []);

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
          const { activity } = res;
          dispatch(
            inviteUserInWorkspace({ user: userInvite, role: selectedRole })
          );
          dispatch(updateActivitiesInWorkspace(activity));

          // socket.emit("sendNotification", {
          //   user_id: userInvite.id,
          //   userName: user.name,
          //   userAvatar: user.avatar,
          //   type: "invite_user",
          //   content: `đã mời bạn vào Không gian làm việc ${workspace.name} với tư cách ${selectedRole}`,
          // });

          toast.success("Mời người dùng vào Không gian làm việc thành công");
          resetForm();

          // socket.emit("inviteUser", {
          //   userInviteId: user.id,
          //   userInvitedId: userInvite.id,
          // });
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
    setUserInvite(null);
    setKeyWord("");
    setUsersSearch([]);
    setIsSearch(false);
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
                    type="text"
                    isRequired
                    name="keyword"
                    id="keyword"
                    placeholder="Địa chỉ email hoặc tên..."
                    className="text-sm rounded-md focus-visible:outline-0 w-full"
                    size="xs"
                    value={keyword}
                    onChange={handleInputChange}
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
                      {isLoading ? (
                        <CircularProgress size={18} />
                      ) : searchError ? (
                        "Đã xảy ra lỗi trong quá trình tìm kiếm."
                      ) : searchResultsValid ? (
                        usersSearch.length > 0 &&
                        usersSearch.map((userSearch) => (
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
                      ) : (
                        "Có vẻ như người đó không phải là thành viên của Trello. Thêm địa chỉ email của họ để mời họ"
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
