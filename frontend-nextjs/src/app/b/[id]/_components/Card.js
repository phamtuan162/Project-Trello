"use client";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paperclip, MessageCircle } from "lucide-react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { Clock } from "lucide-react";
import { format } from "date-fns";

import AssignUser from "./AssignUser";
import { SquareCheck } from "@/components/Icon/SquareCheck";
import { cardSlice } from "@/stores/slices/cardSlice";

const { selectCard, showModalActiveCard } = cardSlice.actions;

export function Card({ card }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

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

    if (!card || !card.works) {
      return [];
    }

    return extractMissions(card.works);
  }, [card?.works]);

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
  }, [user?.role]);

  const backgroundCard = useMemo(() => {
    if (card?.background) {
      return (
        <div
          className={`rounded-t-md relative w-full bg-no-repeat bg-cover bg-center h-[160px] h-max-[200px]`}
          style={{
            backgroundImage: `url(${card.background})`,
          }}
        ></div>
      );
    }
    return null;
  }, [card?.background]);

  const dateCard = useMemo(() => {
    if (card.startDateTime || card.endDateTime) {
      return (
        <div>
          <div
            className={`text-xs mt-1  inline-flex items-center gap-1  ${
              card.status === "success" && "bg-green-700 text-white"
            } ${card.status === "expired" && "bg-red-700 text-white"} ${
              card.status === "up_expired" && "bg-yellow-400 text-white"
            } rounded-sm px-1 py-0.5 `}
          >
            {(card?.startDateTime || card?.endDateTime) &&
              (card.status === "success" ? (
                <SquareCheck size={14} />
              ) : (
                <Clock size={12} />
              ))}

            {card?.startDateTime && (
              <>
                {format(card?.startDateTime, "d 'tháng' M")}
                {card?.endDateTime && " - "}
              </>
            )}

            {card?.endDateTime && format(card?.endDateTime, "d 'tháng' M")}
          </div>
        </div>
      );
    }
    return null;
  }, [card?.startDateTime, card?.endDateTime]);

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
    if (card?.attachments?.length > 0) {
      return (
        <div className="flex gap-1 items-center">
          <Paperclip size={12} /> {card.attachments.length}
        </div>
      );
    }
    return null;
  }, [card.attachments]);

  const commentsCard = useMemo(() => {
    if (card?.comments?.length > 0) {
      return (
        <div className="flex gap-1 items-center">
          <MessageCircle size={12} /> {card.comments.length}
        </div>
      );
    }
    return null;
  }, [card?.comments]);

  const usersCard = useMemo(() => {
    if (card?.users?.length > 0) {
      return (
        <AvatarGroup max={2} className="justify-end group-avatar-1 mt-1.5">
          {card.users.map((user) => (
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
  }, [card?.users]);

  const SetCardActive = () => {
    if (!isAssign && !isDragging) {
      dispatch(showModalActiveCard());
      dispatch(selectCard(card));
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(checkRoleBoard ? listeners : {})}
      onClick={SetCardActive}
      role="button"
      onMouseEnter={() => setIsEdit(true)}
      onMouseLeave={() => setIsEdit(false)}
      className="  text-sm bg-white rounded-md shadow-sm card relative z-45"
    >
      <div>
        <div className="pb-3">{backgroundCard}</div>
        <div className={`p-3 pt-0 relative `}>
          {card?.title}
          <div
            className={`${
              !isEdit || !checkRoleBoard ? "hidden" : ""
            } absolute right-2 -top-1 z-50 `}
          >
            <AssignUser
              isAssign={isAssign}
              setIsAssign={setIsAssign}
              card={card}
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
