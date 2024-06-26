"use client";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import AssignUser from "./AssignUser";
import { Paperclip, MessageCircle } from "lucide-react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import useCardModal from "@/hooks/use-card-modal";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { SquareCheck } from "@/components/Icon/SquareCheck";
export function Card({ card }) {
  const cardData = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const cardUpdate = useMemo(() => {
    return +card.id === +cardData.id ? cardData : card;
  }, [cardData, card]);

  const missions = useMemo(() => {
    const extractMissions = (works) => {
      let allMissions = [];
      works.forEach((work) => {
        if (Array.isArray(work.missions)) {
          allMissions = [...allMissions, ...work.missions];
        }
        if (work.works) {
          allMissions = [...allMissions, ...extractMissions(work.works)];
        }
      });
      return allMissions;
    };

    if (!cardUpdate || !cardUpdate.works) {
      return [];
    }

    return extractMissions(cardUpdate.works);
  }, [cardUpdate]);

  const missionSuccess = useMemo(() => {
    return missions.filter((mission) => mission.status === "success");
  }, [missions]);

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

  const cardModal = useCardModal();
  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    display: card?.FE_PlaceholderCard ? "none" : "block",
  };

  const [isEdit, setIsEdit] = useState(false);
  const [isAssign, setIsAssign] = useState(false);

  const checkRoleBoard = useMemo(() => {
    return (
      user?.role?.toLowerCase() === "admin" ||
      user?.role?.toLowerCase() === "owner"
    );
  }, [user]);

  const backgroundCard = useMemo(() => {
    if (cardUpdate?.background) {
      return (
        <div
          className={`rounded-t-md relative w-full bg-no-repeat bg-cover bg-center h-[160px] h-max-[200px]`}
          style={{
            backgroundImage: `url(${cardUpdate.background})`,
          }}
        ></div>
      );
    }
    return null;
  }, [cardUpdate]);

  const dateCard = useMemo(() => {
    if (cardUpdate.startDateTime || cardUpdate.endDateTime) {
      return (
        <div>
          <div
            className={`text-xs mt-1  inline-flex items-center gap-1  ${
              cardUpdate.status === "success" && "bg-green-700 text-white"
            } ${cardUpdate.status === "expired" && "bg-red-700 text-white"} ${
              cardUpdate.status === "up_expired" && "bg-yellow-400 text-white"
            } rounded-sm px-1 py-0.5 `}
          >
            {(cardUpdate?.startDateTime || cardUpdate?.endDateTime) &&
              (cardUpdate.status === "success" ? (
                <SquareCheck size={14} />
              ) : (
                <Clock size={12} />
              ))}

            {cardUpdate?.startDateTime && (
              <>
                {format(cardUpdate?.startDateTime, "d 'tháng' M")}
                {cardUpdate?.endDateTime && " - "}
              </>
            )}

            {cardUpdate?.endDateTime &&
              format(cardUpdate?.endDateTime, "d 'tháng' M")}
          </div>
        </div>
      );
    }
    return null;
  }, [cardUpdate]);

  const missionsCard = useMemo(() => {
    if (missions?.length > 0) {
      return (
        <div
          className={`text-xs mt-1  inline-flex items-center gap-1  ${
            missionSuccess.length === missions.length &&
            "bg-green-700 text-white"
          }  rounded-sm px-1 py-0.5`}
        >
          <SquareCheck size={14} /> {missionSuccess.length}/{missions.length}
        </div>
      );
    }
    return null;
  }, [missions, missionSuccess]);

  const attachmentsCard = useMemo(() => {
    if (cardUpdate?.attachments?.length > 0) {
      return (
        <div className="flex gap-1 items-center">
          <Paperclip size={12} /> {cardUpdate.attachments.length}
        </div>
      );
    }
    return null;
  }, [cardUpdate]);

  const commentsCard = useMemo(() => {
    if (cardUpdate?.comments?.length > 0) {
      return (
        <div className="flex gap-1 items-center">
          <MessageCircle size={12} /> {cardUpdate.comments.length}
        </div>
      );
    }
    return null;
  }, [cardUpdate]);

  const usersCard = useMemo(() => {
    if (cardUpdate?.users?.length > 0) {
      return (
        <AvatarGroup max={2} className="justify-end group-avatar-1 mt-1.5">
          {cardUpdate.users.map((user) => (
            <Avatar
              key={user.id}
              src={user.avatar}
              name={user.name.charAt(0).toUpperCase()}
              radius="full"
              color="secondary"
            />
          ))}
        </AvatarGroup>
      );
    }
    return null;
  }, [cardUpdate]);

  const handleCardClick = () => {
    if (!isAssign && !isDragging) {
      cardModal.onOpen(cardUpdate.id);
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(checkRoleBoard ? listeners : {})}
      onClick={handleCardClick}
      role="button"
      onMouseEnter={() => setIsEdit(true)}
      onMouseLeave={() => setIsEdit(false)}
      className="  text-sm bg-white rounded-md shadow-sm card relative z-45"
    >
      <div>
        <div className="pb-3">{backgroundCard}</div>
        <div className={`p-3 pt-0 relative `}>
          {cardUpdate?.title}
          <div
            className={`${
              !isEdit || !checkRoleBoard ? "hidden" : ""
            } absolute right-2 -top-1 z-50 `}
          >
            <AssignUser
              isAssign={isAssign}
              setIsAssign={setIsAssign}
              cardUpdate={cardUpdate}
            />
          </div>
          <div className=" mt-1 flex flex-wrap gap-2 w-full">
            {dateCard}
            {missionsCard}
            {attachmentsCard}
            {commentsCard}
          </div>
          {usersCard}
        </div>
      </div>
    </div>
  );
}
