"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckboxGroup } from "@nextui-org/react";
import { toast } from "react-toastify";
import { isPast } from "date-fns";

import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
import { updateMissionApi } from "@/services/workspaceApi";
import MissionWork from "./mission";
import { cloneDeep } from "lodash";

const { updateMissionInCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;
const { updateMissionInMissions } = missionSlice.actions;

const MissionsWork = ({ missions }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  const [missionSelected, setMissionSelected] = useState(null);

  const missionsIdSelected = useMemo(() => {
    const missionsSuccess =
      missions?.filter(
        (mission) => mission.status.toLowerCase() === "success"
      ) || [];

    return missionsSuccess.map((mission) => mission.id);
  }, [missions]);

  const HandleSelectMission = async (select) => {
    const isMissionSelected = select.includes(missionSelected.id);
    let statusMission = "pending";

    if (isMissionSelected) {
      statusMission = "success";
    } else if (
      missionSelected.endDateTime &&
      isPast(new Date(missionSelected.endDateTime))
    ) {
      statusMission = "expired";
    }

    await toast
      .promise(
        async () =>
          await updateMissionApi(missionSelected.id, { status: statusMission }),
        { pending: "Đang cập nhật..." }
      )
      .then((res) => {
        const works = cloneDeep(card.works);
        const work = works.find((w) => w.id === missionSelected.work_id);
        const mission = work?.missions.find((m) => m.id === missionSelected.id);

        if (mission) mission.status = statusMission;

        dispatch(
          updateMissionInCard({
            id: missionSelected.id,
            work_id: missionSelected.work_id,
            status: statusMission,
          })
        );

        dispatch(
          updateCardInBoard({
            id: card.id,
            column_id: card.column_id,
            works,
          })
        );

        if (missionSelected.user_id === user.id) {
          dispatch(
            updateMissionInMissions({
              id: missionSelected.id,
              status: statusMission,
            })
          );
        }

        toast.success("Cập nhật trạng thái thành công");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        value={missionsIdSelected}
        onValueChange={(select) => {
          HandleSelectMission(select);
        }}
        className="select flex"
      >
        {missions?.map((mission) => (
          <div key={mission.id}>
            <MissionWork
              mission={mission}
              setMissionSelected={setMissionSelected}
            />
          </div>
        ))}
      </CheckboxGroup>
    </div>
  );
};
export default MissionsWork;
