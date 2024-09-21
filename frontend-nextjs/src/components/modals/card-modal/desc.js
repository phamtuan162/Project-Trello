"use client";
import { AlignLeft } from "lucide-react";
import { useState, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Textarea, Button, CircularProgress } from "@nextui-org/react";
import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;

const DescCardModal = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const formRef = useRef(null);
  const textareaRef = useRef(null);
  const btnRef = useRef();
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      disableEditing();
    }
    if (e.key === "Enter") {
      btnRef.current.click();
    }
  };

  useOnClickOutside(formRef, disableEditing);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const desc = formData.get("desc");
    if (!desc) return;

    setIsUpdate(true);
    try {
      const data = await updateCardApi(card.id, { desc });
      if (data.status === 200) {
        dispatch(updateCard({ ...card, desc }));
        setIsEditing(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thẻ");
    } finally {
      setIsUpdate(false);
    }
  };
  return (
    <div className="flex items-start gap-x-4 w-full">
      <AlignLeft size={24} />
      <div className="w-full">
        <p className="font-semibold  mb-2 text-sm">Mô tả</p>
        {isEditing ? (
          <form onSubmit={onSubmit} ref={formRef} className="space-y-2">
            <Textarea
              id="desc"
              name="desc"
              variant="bordered"
              disableAnimation
              disableAutosize
              className="w-full mt-2 text-sm font-medium"
              placeholder="Thêm mô tả chi tiết hơn..."
              classNames={{
                input: "resize-y min-h-[60px] ",
              }}
              defaultValue={card?.desc || undefined}
              ref={textareaRef}
              onKeyDown={onKeyDown}
            />
            <div className="flex items-center gap-x-2">
              <Button
                disabled={isUpdate}
                type="submit"
                size="sm"
                radius="lg"
                color="secondary"
                ref={btnRef}
              >
                {isUpdate ? <CircularProgress /> : "Lưu"}
              </Button>
              <Button
                disabled={isUpdate}
                type="button"
                size="sm"
                radius="lg"
                color="danger"
                onClick={() => disableEditing()}
              >
                {isUpdate ? <CircularProgress /> : "Hủy bỏ"}
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={() => {
              if (
                user?.role?.toLowerCase() === "admin" ||
                user?.role?.toLowerCase() === "owner"
              ) {
                enableEditing();
              }
            }}
            role="button"
            className="min-h-[78px] bg-gray-200 text-sm font-medium py-3 px-3.5 rounded-md"
            dangerouslySetInnerHTML={{
              __html: card?.desc || "Thêm mô tả chi tiết hơn...",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};
export default DescCardModal;
