"use client";
import { useMemo } from "react";
import { Copy, Trash, ArrowRight } from "lucide-react";
import { Button } from "@nextui-org/react";
import MoveCard from "@/components/actions/card/moveCard";
import CopyCard from "@/components/actions/card/copyCard";
import DeleteCard from "@/components/actions/card/deleteCard";
import { useSelector } from "react-redux";
const ActionsCard = () => {
  const user = useSelector((state) => state.user.user);

  const isAdminOrOwner = useMemo(() => {
    return (
      user.role.toLowerCase() === "admin" || user.role.toLowerCase() === "owner"
    );
  }, [user]);
  const actions = useMemo(() => {
    return [
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
      isAdminOrOwner && {
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
    ].filter(Boolean);
  }, [isAdminOrOwner]);
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
