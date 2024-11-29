"use client";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

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

const { clearAndHideCard } = cardSlice.actions;

export const CardModal = () => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  const isShowModalActiveCard = useSelector(
    (state) => state.card.isShowModalActiveCard
  );

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

  const HandleCloseModel = async () => {
    dispatch(clearAndHideCard());
  };

  return (
    <Modal
      isOpen={isShowModalActiveCard}
      onOpenChange={HandleCloseModel}
      isDismissable={false}
      classNames={{
        closeButton: [
          `z-50 w-[32px] h-[32px] mr-1 mt-1 ${
            card && card.background
              ? "active:bg-red-500 hover:bg-red-500 text-white"
              : ""
          }`,
        ],
      }}
    >
      <ModalContent className=" max-w-2xl  self-start">
        {(HandleCloseModel) => (
          <>
            {card?.background && <BackgroundCard />}

            <ModalBody className="p-3 px-4">
              <TitleModal />
              <div className="grid grid-cols-1 md:grid-cols-8 md:gap-4">
                <div className="col-span-6">
                  <div className="w-full space-y-6">
                    <div className="ml-9 mt-1 flex gap-4 flex-wrap">
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
    </Modal>
  );
};
