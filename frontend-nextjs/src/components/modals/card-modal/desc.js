"use client";
import { AlignLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

import { updateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const DescCardModal = () => {
  const dispatch = useDispatch();

  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  // State xử lý chế độ Edit và chế độ View
  const [markdownEditMode, setMarkdownEditMode] = useState(false);
  // State xử lý giá trị markdown khi chỉnh sửa
  const [cardDescription, setCardDescription] = useState(card?.desc || "");

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const onUpdateDesc = async () => {
    await toast
      .promise(
        async () => await updateCardApi(card.id, { desc: cardDescription }),
        {
          pending: "Đang cập nhật...",
        }
      )
      .then(async (res) => {
        dispatch(updateCard({ desc: cardDescription })),
          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              desc: cardDescription,
            })
          );

        toast.success("Cập nhật thành công");
      })
      .catch((error) => {
        setCardDescription(card.desc);
        console.log(error);
      })
      .finally(() => {
        setMarkdownEditMode(false);
      });
  };

  return (
    <div className="flex items-start gap-x-4 w-full">
      <AlignLeft size={24} />
      <div className="w-full">
        <div className="flex justify-between	mb-2">
          <p className="font-semibold  mb-2 text-sm">Mô tả</p>
          {!markdownEditMode && (
            <button
              onClick={() => checkRole && setMarkdownEditMode(true)}
              className="text-xs   px-2 rounded-sm bg-gray-100 hover:bg-gray-200"
              type="button"
            >
              Chỉnh sửa
            </button>
          )}
        </div>
        {markdownEditMode ? (
          <>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }} // https://www.npmjs.com/package/@uiw/react-md-editor#security
              height={300}
              preview="edit" // Có 3 giá trị để set tùy nhu cầu ['edit', 'live', 'preview']
              // hideToolbar={true}
            />
            <div className="flex items-center gap-x-2 mt-2">
              <Button
                className="interceptor-loading"
                type="button"
                size="sm"
                radius="lg"
                color="secondary"
                onClick={() => onUpdateDesc()}
              >
                Lưu
              </Button>
              <Button
                className="interceptor-loading"
                type="button"
                size="sm"
                radius="lg"
                color="danger"
                onClick={() => setMarkdownEditMode(false)}
              >
                Hủy bỏ
              </Button>
            </div>
          </>
        ) : (
          <div>
            <MDEditor.Markdown
              source={cardDescription || "Thêm mô tả chi tiết hơn..."}
              style={{
                fontWeight: "500",
                fontSize: "12px",
                background: !cardDescription && "#091E420F",
                border: cardDescription
                  ? "0.5px solid rgba(0, 0, 0, 0.2)"
                  : "none",
                padding: "8px 12px 32px",
                whiteSpace: "pre-wrap",
                borderRadius: "3px",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default DescCardModal;
