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
import { Message } from "@/components/Message/Message";
import { deleteWorkspaceApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
const FormDeleteWorkspace = ({ workspace }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(
    "Bằng cách xóa không gian làm việc này, bạn sẽ xóa tất cả các bảng và dự án.Tất cả dữ liệu và tín dụng thanh toán của bạn sẽ bị mất."
  );
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDelete, setIsDelete] = useState(false);
  const user = useSelector((state) => state.user.user);
  const nameRef = useRef(null);

  const HandleDeleteWorkspace = async () => {
    const workspaces = user.workspaces.filter(
      (ws) => ws.role.toLowerCase() === "owner"
    );

    if (name !== workspace.name && name === "") {
      setMessage("Tên không gian làm việc không hợp lệ, Vui lòng nhập lại!");
      nameRef.current.focus();
      return;
    }

    if (workspaces.length === 1) {
      toast.warning("Bạn chỉ có duy nhất workspace này nên không thể xóa!");
      return;
    }

    setIsDelete(true);

    try {
      const { status, error, message } = await deleteWorkspaceApi(workspace.id);
      if (200 <= status && status <= 299) {
        const users = workspace.users.filter(
          (item) => +item.id !== +user.id && item.isOnline
        );

        users.forEach((userItem) => {
          socket.emit("sendNotification", {
            user_id: userItem.id,
            userName: user.name,
            userAvatar: user.avatar,
            type: "delete_workspace",
            content: `đã xóa Không gian làm việc ${workspace.name}`,
          });
        });

        toast.success(
          "Xóa thành công! Vui lòng chờ một chút để chuyển đến Không gian khác."
        );
        document.location.href = "/";
      } else {
        setMessage(error);
      }
    } catch (error) {
      console.log(error || message);
    } finally {
      setIsDelete(false);
    }
  };

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
                    {workspace.name}
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
                    isDisabled={isDelete}
                    onPress={onClose}
                    type="button"
                    className="rounded-lg text-md font-medium text-white   flex items-center justify-center py-2"
                    color="primary"
                  >
                    {isDelete ? <CircularProgress size={16} /> : " Hủy bỏ"}
                  </Button>
                  <Button
                    onClick={() => HandleDeleteWorkspace()}
                    isDisabled={isDelete}
                    type="submit"
                    className="rounded-lg text-md font-medium text-white   flex items-center justify-center py-2"
                    color="danger"
                  >
                    {isDelete ? <CircularProgress size={16} /> : " Xóa bỏ"}
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
