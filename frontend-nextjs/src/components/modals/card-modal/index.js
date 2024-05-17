"use client";
import {
  CircularProgress,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import useCardModal from "@/hooks/use-card-modal";
import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCardDetail } from "@/services/workspaceApi";
import TitleModal from "./title";
import DescCardModal from "./desc";
import ActivityCard from "./activity";
import ActionsCard from "./actions";
import AddToCard from "./addToCard";
import UserCard from "./users";
import BackgroundCard from "./background";
import DateCard from "./date";
import WorksCard from "./works";
import AttachmentList from "./attachments";
import CommentCard from "./comments";
import { cardSlice } from "@/stores/slices/cardSlice";
import { columnSlice } from "@/stores/slices/columnSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
const { updateCard } = cardSlice.actions;
const { updateBoard } = boardSlice.actions;
export const CardModal = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const board = useSelector((state) => state.board.board);
  const user = useSelector((state) => state.user.user);
  const checkRole = useMemo(() => {
    return (
      user?.role?.toLowerCase() === "admin" ||
      user?.role?.toLowerCase() === "owner"
    );
  }, [user]);
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true);

      getCardDetail(id).then((data) => {
        if (data.status === 200) {
          const cardUpdate = data.data;
          if (+cardUpdate.id !== +card.id && card.id) {
            const columnsUpdate = board.columns.map((column) => {
              const index = column.cards.findIndex((c) => +c.id === +card.id);
              if (index !== -1) {
                const updatedColumn = {
                  ...column,
                  cards: column.cards.map((c, i) => (i === index ? card : c)),
                };
                return updatedColumn;
              }
              return column;
            });

            dispatch(updateBoard({ ...board, columns: columnsUpdate }));
          }
          dispatch(updateCard(cardUpdate));
          dispatch(columnSlice.actions.updateColumn(board.columns));
          setIsLoading(false);
        }
      });
    };

    if ((id && card.id !== id && card.id) || (!card.id && id)) {
      fetchCardData();
    }
  }, [id]);
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      classNames={{
        closeButton: [`z-50 ${isLoading && "hidden"}`],
      }}
    >
      {isLoading ? (
        <ModalContent className="p-3 px-4 max-w-2xl ">
          <CircularProgress />
        </ModalContent>
      ) : (
        <ModalContent className=" max-w-2xl  self-start">
          {(onClose) => (
            <>
              {card?.background && <BackgroundCard />}

              <ModalBody className="p-3 px-4">
                <TitleModal />
                <div className="grid grid-cols-1 md:grid-cols-8 md:gap-4">
                  <div className="col-span-6">
                    <div className="w-full space-y-6">
                      <div className="ml-9 mt-2 flex gap-4 flex-wrap">
                        <UserCard />
                        {(card?.startDateTime || card?.endDateTime) && (
                          <DateCard checkRole={checkRole} />
                        )}
                      </div>
                      <DescCardModal />
                      {card?.attachments?.length > 0 && <AttachmentList />}
                      {card?.works?.length > 0 && <WorksCard />}
                      <CommentCard />
                      <ActivityCard />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <AddToCard />
                    <ActionsCard />
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      )}
    </Modal>
  );
};
