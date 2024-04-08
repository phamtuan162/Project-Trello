"use client";
import {
  CircularProgress,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";
import useCardModal from "@/hooks/use-card-modal";
import { cardSlice } from "@/stores/slices/cardSlice";
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
const { updateCard } = cardSlice.actions;
export const CardModal = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCardData = async () => {
      setIsLoading(true);

      getCardDetail(id).then((data) => {
        if (data.status === 200) {
          const card = data.data;
          dispatch(updateCard(card));
          setIsLoading(false);
        }
      });
    };

    if ((id && card.id !== id && card.id) || (!card.id && id)) {
      fetchCardData();
    }
  }, [id]);
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
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
                <div className="grid grid-cols-1 md:grid-cols-5 md:gap-4">
                  <div className="col-span-4">
                    <div className="w-full space-y-6">
                      <div className="ml-9 mt-2 flex gap-4 flex-wrap">
                        <UserCard />
                        {(card?.startDateTime || card?.endDateTime) && (
                          <DateCard />
                        )}
                      </div>

                      <DescCardModal />
                      <ActivityCard />
                    </div>
                  </div>
                  <div>
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
