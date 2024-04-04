"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AssignUser from "./AssignUser";
import { CalendarCheck, Tags, Flag, Check, Pencil } from "lucide-react";
import { MoreIcon } from "@/components/Icon/MoreIcon";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import useCardModal from "@/hooks/use-card-modal";
export function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: { ...card },
  });
  const user = useSelector((state) => state.user.user);
  const cardModal = useCardModal();
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    display: card?.FE_PlaceholderCard ? "none" : "block",
  };

  const actions = [
    {
      label: "Ngày đến hạn",
      icon: <CalendarCheck size={18} />,
    },
    {
      label: "Nhãn thẻ",
      icon: <Tags size={18} />,
    },
    {
      label: "Ưu tiên",
      icon: <Flag size={18} />,
    },
    {
      label: "Chỉnh sửa",
      icon: <Pencil size={18} />,
    },
    {
      label: "Đóng nhiệm vụ",
      icon: <Check size={18} className="hover:text-green-400" />,
    },
    {
      label: "Hành động khác",
      icon: <MoreIcon size={18} />,
    },
  ];
  const [isEdit, setIsEdit] = useState(false);
  const [userAssigned, setUserAssigned] = useState(card.users);
  const [isAssign, setIsAssign] = useState(false);
  const [isDrop, setIsDrop] = useState(false);

  const checkRoleCard = useMemo(() => {
    return card?.users?.some((item) => +user.id === +item.id);
  }, [user, card]);
  const checkRoleBoard = useMemo(() => {
    return user?.role?.toLowerCase() === "admin";
  }, [user]);
  useEffect(() => {
    if (card?.users) {
      setUserAssigned(card.users);
    }
  }, [card]);
  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...((isAssign && isDrop) || (checkRoleBoard && isDrop) ? listeners : {})}
      key={card.id}
      role="button"
      onClick={() => {
        cardModal.onOpen(card.id);
      }}
      className="  text-sm bg-white rounded-md shadow-sm card relative z-45"
    >
      {card?.background && (
        <div
          className={`rounded-t-md relative w-full bg-no-repeat bg-cover bg-center h-[160px] h-max-[200px]`}
          style={{
            backgroundImage: `url(${card.background})`,
          }}
        ></div>
      )}

      <div className={`p-3  relative $`}>
        {card.title}
        <div
          className={`${
            !isEdit || checkRoleBoard ? "hidden" : ""
          } absolute right-2 top-1/2 -translate-y-1/2 z-50 `}
        >
          <AssignUser
            setUserAssigned={setUserAssigned}
            isAssign={isAssign}
            setIsAssign={setIsAssign}
            userAssigned={userAssigned}
            card={card}
          />
        </div>

        <AvatarGroup max={2} className="justify-start group-avatar-1 mt-1">
          {userAssigned?.map((user) => (
            <Avatar
              key={user.id}
              src={user.avatar}
              name={user.name.charAt(0).toUpperCase()}
              radius="full"
              color="secondary"
            />
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}
//  {isEdit && (
//       <div className="border-t-1 border-solid border-default-300 p-2 flex items-center gap-3  text-default-400">
//         {actions.map((action, index) => (
//           <div
//             key={index}
//             className={`hover:text-indigo-400 ${index === 4 && "ml-auto"}`}
//           >
//             {action.icon}
//           </div>
//         ))}
//       </div>
//     )}
