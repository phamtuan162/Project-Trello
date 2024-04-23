"use client";
import { Copy, Trash, ArrowRight, Share2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import useCardModal from "@/hooks/use-card-modal";
import { Button } from "@nextui-org/react";
import MoveCard from "@/components/actions/card/moveCard";
import CopyCard from "@/components/actions/card/copyCard";
import DeleteCard from "@/components/actions/card/deleteCard";
const ActionsCard = () => {
  const cardModal = useCardModal();
  const board = useSelector((state) => state.board.board);

  const actions = [
    {
      label: "Di chuyển",
      icon: <ArrowRight size={16} />,
      component: (
        <MoveCard>
          <Button
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
        <CopyCard>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <Copy size={16} />
            Sao chép
          </Button>
        </CopyCard>
      ),
    },
    {
      label: "Xóa",
      icon: <Trash size={16} />,
      component: (
        <DeleteCard>
          <Button
            className="w-full justify-start bg-gray-200 font-medium flex items-center text-xs whitespace-normal"
            style={{ color: "#172b4d" }}
          >
            <Trash size={16} />
            Xóa
          </Button>
        </DeleteCard>
      ),
    },
  ];
  return (
    <div className="space-y-2 mt-6" key={"actions"}>
      <p className="text-xs font-medium" style={{ color: "#44546f" }}>
        Thao tác
      </p>
      {actions.map((action, index) => (
        <div key={index}>{action.component}</div>
      ))}
    </div>
  );
};
export default ActionsCard;
