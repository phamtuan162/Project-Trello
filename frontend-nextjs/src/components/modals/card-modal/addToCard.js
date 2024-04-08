import { useState } from "react";
import { Paperclip, User, Clock, Image } from "lucide-react";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import { Button } from "@nextui-org/react";
import AssignUser from "@/app/b/[id]/_components/AssignUser";
import { useSelector } from "react-redux";
import FormBackground from "@/components/Form/FormBackground";
import FormDate from "@/components/Form/FormDate";
const AddToCard = () => {
  const [isAssign, setIsAssign] = useState(false);
  const card = useSelector((state) => state.card.card);

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
            key={1}
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
        <Button
          key={2}
          className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          <SquareCheck size={16} />
          Việc cần làm
        </Button>
      ),
    },
    {
      label: "Ngày",
      icon: <Clock size={16} />,
      component: (
        <FormDate>
          <Button
            key={3}
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
        <FormBackground>
          <Button
            key={4}
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
        <Button
          key={5}
          className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          <Paperclip size={16} />
          Đính kèm
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-medium" style={{ color: "#44546f" }}>
        Thêm vào thẻ
      </p>
      {actions.map((action, index) => action.component)}
    </div>
  );
};

export default AddToCard;
