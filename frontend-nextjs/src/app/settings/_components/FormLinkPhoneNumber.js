"use client";
import { useRef, useState } from "react";
import {
  Input,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  Button,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { Message } from "@/components/Message/Message";
import { userSlice } from "@/stores/slices/userSlice";

const { updateUser } = userSlice.actions;

const FormLinkPhoneNumber = ({ user }) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [phone, setPhone] = useState("");
  const [validPhone, setValidPhone] = useState(false);
  const phoneRef = useRef(null);

  const phoneRegex =
    /^\+?[0-9]{1,3}?[-.\s]?[0-9]{3,4}[-.\s]?[0-9]{3}[-.\s]?[0-9]{3,4}$/;

  const handleChange = (e) => {
    const phoneNumber = e.target.value;
    setPhone(phoneNumber);
    if (validPhone) {
      setValidPhone(false);
    }
  };

  const handleClick = () => {
    if (phoneRegex.test(phone)) {
      onOpen();
    } else {
      setValidPhone(true);
    }
  };
  return (
    <div className="mt-6" style={{ borderTop: "1px solid rgb(230, 230, 230)" }}>
      <h2 className="text-2xl font-medium mt-4">Liên kết số điện thoại</h2>
      <p className="mt-1">
        Liên kết số điện thoại với tài khoản để sử dụng tính năng này. Hãy chắc
        chắn rằng số điện thoại của bạn chính xác và thuộc quyền sở hữu của bạn.
      </p>
      <form className="pt-6">
        <Input
          ref={phoneRef}
          id="phone"
          name="phone"
          labelPlacement="outside"
          radius="lg"
          size="md"
          type="tel"
          className="max-w-md"
          variant="bordered"
          label={
            <label className="text-default-400 text-sm uppercase">
              Số điện thoại liên kết
            </label>
          }
          errorMessage={validPhone && "Số điện thoại không hợp lệ"}
          placeholder="Nhập số điện thoại"
          onChange={handleChange}
        />
        <Button
          type="button"
          onClick={handleClick}
          isDisabled={!validPhone && phone === ""}
          color="danger"
          className="font-medium w-28 h-9 rounded-lg px-3 text-sm mt-4 mb-6"
        >
          Liên kết
        </Button>
        <Modal
          placement="top-center"
          isOpen={isOpen}
          onOpenChange={(open) => {
            onOpenChange(open);
          }}
          onClose={() => {}}
          backdrop="opaque"
        >
          <ModalContent className="max-w-xl ">
            {(onClose) => (
              <div className="p-4 h-full w-full">
                <h2 className="text-3xl font-bold">Liên kết số điện thoại</h2>
                <div className="text-default-500 text-base mt-4">
                  Bạn sẽ mất quyền truy cập vào tất cả không gian làm việc,
                  không gian con và dự án của mình.
                </div>
                <Message message={message} />
                <Button
                  type="button"
                  className="rounded-lg text-xl font-medium text-white mt-4 w-full py-2"
                  color="primary"
                >
                  Xác nhận
                </Button>
              </div>
            )}
          </ModalContent>
        </Modal>
      </form>
    </div>
  );
};

export default FormLinkPhoneNumber;
