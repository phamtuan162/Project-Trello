"use client";
import { useState } from "react";
import { Paperclip, User, Clock, Image } from "lucide-react";
import { Button } from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

import AssignUser from "@/app/b/[id]/_components/AssignUser";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import FormBackground from "@/components/Form/FormBackground";
import FormDate from "@/components/Form/FormDate";
import { updateCardApi } from "@/services/workspaceApi";
import AddWork from "@/components/actions/work/addWork";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import AttachmentFile from "@/components/actions/card/attchmentFile";
import { singleFileValidator } from "@/utils/validators";

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const AddToCard = () => {
  const dispatch = useDispatch();
  const [isAssign, setIsAssign] = useState(false);
  const card = useSelector((state) => state.card.card);

  const HandleBackground = async (data) => {
    let reqData;
    let isFile;
    try {
      // Kiểm tra xem dữ liệu là FormData hay e.target.files
      if (data instanceof FormData) {
        // Trường hợp FormData
        const image = data.get("image");
        if (image) {
          reqData = { background: image };
        } else {
          toast.error("Hình ảnh không hợp lệ.");
          return;
        }
      } else if (data?.target?.files) {
        isFile = true;
        // Trường hợp e.target.files
        const file = data.target.files[0];

        // Kiểm tra tính hợp lệ của file
        const validationError = singleFileValidator(file);
        if (validationError) {
          toast.error(validationError);
          return;
        }

        reqData = new FormData();
        reqData.append("cardCover", file);
      }

      if (!reqData) {
        toast.error("Không có dữ liệu để cập nhật.");
        return;
      }

      await toast
        .promise(async () => await updateCardApi(card.id, reqData), {
          pending: "Đang cập nhật...",
        })
        .then((res) => {
          const { data } = res;

          dispatch(updateCard({ background: data.background }));
          dispatch(
            updateCardInBoard({
              id: card.id,
              column_id: card.column_id,
              background: data.background,
            })
          );
          toast.success("Cập nhật thành công");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          if (isFile) data.target.value = "";
        });
    } catch (error) {
      console.log(error);
    }
  };

  const actions = [
    {
      label: "Thành viên",
      icon: <User size={16} />,
      component: (
        <AssignUser
          cardUpdate={card}
          setIsAssign={setIsAssign}
          isAssign={isAssign}
        >
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <User size={16} />
            Thành viên
          </Button>
        </AssignUser>
      ),
    },
    {
      label: "Việc cần làm",
      icon: <SquareCheck size={16} />,
      component: (
        <AddWork>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <SquareCheck size={16} />
            Việc cần làm
          </Button>
        </AddWork>
      ),
    },
    {
      label: "Ngày",
      icon: <Clock size={16} />,
      component: (
        <FormDate>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <Clock size={16} />
            Ngày
          </Button>
        </FormDate>
      ),
    },
    {
      label: "Ảnh bìa",
      icon: <Image size={16} />,
      component: (
        <FormBackground isCardActive={true} HandleBackground={HandleBackground}>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <Image size={16} />
            Ảnh bìa
          </Button>
        </FormBackground>
      ),
    },
    {
      label: "Đính kèm",
      icon: <Paperclip size={16} />,
      component: (
        <AttachmentFile>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <Paperclip size={16} />
            Đính kèm
          </Button>
        </AttachmentFile>
      ),
    },
  ];

  return (
    <div className="space-y-2 mt-2" key={"addToCard"}>
      <p className="text-xs font-medium" style={{ color: "#44546f" }}>
        Thêm vào thẻ
      </p>
      {actions.map((action, index) => (
        <div key={index}>{action.component}</div>
      ))}
    </div>
  );
};

export default AddToCard;
