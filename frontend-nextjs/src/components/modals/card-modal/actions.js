"use client";
import { Copy, Trash, ArrowRight, Share2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import useCardModal from "@/hooks/use-card-modal";
import { Button } from "@nextui-org/react";
const ActionsCard = () => {
  const cardModal = useCardModal();
  const card = useSelector((state) => state.card.card);
  const actions = [
    {
      label: "Di chuyển",
      icon: <ArrowRight size={16} />,
    },
    {
      label: "Sao chép",
      icon: <Copy size={16} />,
    },
    {
      label: "Xóa",
      icon: <Trash size={16} />,
    },
    {
      label: "Chia sẻ",
      icon: <Share2 size={16} />,
    },
  ];

  return (
    <div className="space-y-2 mt-6">
      <p className="text-xs font-medium" style={{ color: "#44546f" }}>
        Thao tác
      </p>
      {actions.map((action, index) => (
        <Button
          key={index}
          className="w-full justify-start bg-gray-200 font-medium  flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          {action.icon}
          {action.label}
        </Button>
      ))}
    </div>
  );
};
export default ActionsCard;
