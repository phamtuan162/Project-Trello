import { useState } from "react";
import { Paperclip, User, Clock, Image } from "lucide-react";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import { Button } from "@nextui-org/react";
import AssignUser from "@/app/b/[id]/_components/AssignUser";
import { useSelector, useDispatch } from "react-redux";
import FormBackground from "@/components/Form/FormBackground";
import FormDate from "@/components/Form/FormDate";
import { updateCardApi } from "@/services/workspaceApi";
import AddWork from "@/components/actions/work/addWork";
import { cardSlice } from "@/stores/slices/cardSlice";
import AttachmentFile from "@/components/actions/card/attchmentFile";
const { updateCard } = cardSlice.actions;

const AddToCard = () => {
  const dispatch = useDispatch();
  const [isAssign, setIsAssign] = useState(false);
  const card = useSelector((state) => state.card.card);

  const HandleBackground = async (formData) => {
    const image = formData.get("image");
    if (image) {
      updateCardApi(card.id, { background: image }).then((data) => {
        if (data.status === 200) {
          const cardUpdate = { ...card, background: image };
          dispatch(updateCard(cardUpdate));
        } else {
          const error = data.error;
          toast.error(error);
        }
      });
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
        <FormBackground HandleBackground={HandleBackground}>
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
