"use client";
import { Copy, Trash, ArrowRight, Share2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import useCardModal from "@/hooks/use-card-modal";
import { Button } from "@nextui-org/react";
import MoveCard from "@/components/actions/card/moveCard";
const ActionsCard = () => {
  const cardModal = useCardModal();
  const card = useSelector((state) => state.card.card);

  const actions = [
    {
      label: "Di chuyển",
      icon: <ArrowRight size={16} />,
      component: (
        <MoveCard>
          <Button
            key={1}
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <ArrowRight size={16} />
            Di chuyển
          </Button>
        </MoveCard>
      ),
    },
    {
      label: "Sao chép",
      icon: <Copy size={16} />,
      component: (
        <Button
          key={2}
          className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          <Copy size={16} />
          Sao chép
        </Button>
      ),
    },
    {
      label: "Xóa",
      icon: <Trash size={16} />,
      component: (
        <Button
          key={3}
          className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          <Trash size={16} />
          Xóa
        </Button>
      ),
    },
    {
      label: "Chia sẻ",
      icon: <Share2 size={16} />,
      component: (
        <Button
          key={4}
          className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
          style={{ color: "#172b4d" }}
        >
          <Share2 size={16} />
          Chia sẻ
        </Button>
      ),
    },
  ];
  return (
    <div className="space-y-2 mt-6">
      <p className="text-xs font-medium" style={{ color: "#44546f" }}>
        Thao tác
      </p>
      {actions.map((action) => action.component)}
    </div>
  );
};
export default ActionsCard;
