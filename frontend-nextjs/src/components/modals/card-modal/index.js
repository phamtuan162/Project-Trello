"use client";
import { CircularProgress } from "@nextui-org/react";
import { Dialog, DialogContent } from "@/components/ui/Dialog";
import useCardModal from "@/hooks/use-card-modal";
import { cardSlice } from "@/stores/slices/cardSlice";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCard } from "@/stores/middleware/fetchCard";
import { getCardDetail } from "@/services/workspaceApi";
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
            <div className="col-span-3">
              <div className="w-full space-y-6">{card?.title}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
