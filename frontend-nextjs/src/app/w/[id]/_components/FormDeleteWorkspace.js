"use client";
import {
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

import Loading from "@/components/Loading/Loading";
import { Message } from "@/components/Message/Message";
import { deleteWorkspaceApi } from "@/services/workspaceApi";
import { useRouter } from "next/navigation";
import { userSlice } from "@/stores/slices/userSlice";
import { fetchWorkspace } from "@/stores/middleware/fetchWorkspace";
import { fetchMission } from "@/stores/middleware/fetchMission";

const { deleteWorkspaceInUser } = userSlice.actions;

const FormDeleteWorkspace = ({ workspace }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "Xóa không gian làm việc sẽ xóa toàn bộ bảng, dự án và dữ liệu liên quan. Sau khi xóa, bạn sẽ được chuyển đến một không gian khác mà bạn sở hữu hoặc tham gia."
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state) => state.user.user);
  const nameRef = useRef(null);

  const HandleDeleteWorkspace = async () => {
    try {
      if (name !== workspace.name || name === "") {
        setMessage("Tên không gian làm việc không hợp lệ, vui lòng nhập lại!");
        nameRef.current.focus();
        return;
      }

      const workspaces = user.workspaces.filter(
        (ws) => ws.role.toLowerCase() === "owner"
      );

      if (workspaces.length === 1) {
        toast.warning("Bạn chỉ có duy nhất workspace này nên không thể xóa!");
        return;
      }

      await toast
        .promise(async () => await deleteWorkspaceApi(workspace.id), {
          pending: "Đang xóa...",
        })
        .then(async (res) => {
          const { data } = res;

          setIsLoading(true);

          toast.success(
            "Xóa thành công! Vui lòng chờ một chút để chuyển đến Không gian khác."
          );

          await Promise.all([
            dispatch(
              deleteWorkspaceInUser({
                user: {
                  role: data.role,
                  workspace_id_active: data.workspace_id_active,
                },
                workspace: { id: workspace.id },
              })
            ),
            // Fetch workspace, missions  of user

            dispatch(fetchWorkspace(data.workspace_id_active)),
            dispatch(
              fetchMission({
                user_id: data.id,
                workspace_id: data.workspace_id_active,
              })
            ),
          ]);

          router.push(`/w/${data.workspace_id_active}/home`);

          // const users = workspace.users.filter(
          //   (item) => +item.id !== +user.id && item.isOnline
          // );

          // users.forEach((userItem) => {
          //   socket.emit("sendNotification", {
          //     user_id: userItem.id,
          //     userName: user.name,
          //     userAvatar: user.avatar,
          //     type: "delete_workspace",
          //     content: `đã xóa Không gian làm việc ${workspace.name}`,
          //   });
          // });
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.data?.isMessage) {
            setMessage(error.response.data.message);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  if (isLoading) {
    return <Loading backgroundColor={"white"} zIndex={"100"} />;
  }

  return (
    <div className="pt-8 w-full border-t-1 border-solid border-default-400">
      <h2 className="text-2xl font-medium">Xóa Không gian làm việc</h2>
      <p className="mt-1 max-w-[500px]">
        Khi bạn xóa không gian làm việc các bảng,danh sách,v.v trong không gian
        làm việc sẽ bị xóa cùng
      </p>
      <Button
        isDisabled={user?.role?.toLowerCase() !== "owner"}
        type="button"
        onPress={onOpen}
        color="danger"
        className="font-medium  h-9 rounded-lg px-3 text-sm mt-4 mb-6 text-md"
      >
        Xóa không gian làm việc
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
          setMessage(
            "Bằng cách xóa không gian làm việc này, bạn sẽ xóa tất cả các bảng và dự án.Tất cả dữ liệu và tín dụng thanh toán của bạn sẽ bị mất."
          );
        }}
        placement="center"
        backdrop="opaque"
        classNames={{
          content: ["py-3 px-4 border border-default-200 "],
        }}
      >
        <ModalContent className=" w-full px-2 py-2 ">
          {(onClose) => (
            <>
              <ModalHeader className=" w-full ">
                <h2 className="text-3xl font-normal text-red-400">
                  Xóa không gian làm việc
                </h2>
              </ModalHeader>
              <ModalBody>
                <div className="mt-2">
                  <Message message={message} />
                </div>

                <p className="mt-2">
                  Vui lòng nhập lại
                  <span className="font-bold text-sm mx-1 ">
                    {workspace?.name}
                  </span>
                  để xác nhận
                </p>
                <Input
                  isRequired
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Tên không gian làm việc..."
                  variant="bordered"
                  className="mt-2"
                  ref={nameRef}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <div className="flex w-full justify-end gap-3 mt-4">
                  <Button
                    onPress={onClose}
                    type="button"
                    className="rounded-lg text-md font-medium text-white interceptor-loading   flex items-center justify-center py-2"
                    color="primary"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    onClick={() => HandleDeleteWorkspace()}
                    type="submit"
                    className="rounded-lg text-md font-medium text-white  interceptor-loading flex items-center justify-center py-2"
                    color="danger"
                  >
                    Xóa bỏ
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
export default FormDeleteWorkspace;
