"use client";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CheckboxGroup, Checkbox } from "@nextui-org/react";
import { cardSlice } from "@/stores/slices/cardSlice";
import { updateMissionApi } from "@/services/workspaceApi";
import { toast } from "react-toastify";
const { updateCard } = cardSlice.actions;
const MissionsWork = ({ missions }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  console.log(missions);
  const missionsSelected = useMemo(() => {
    const missionsSuccess = missions.filter(
      (mission) => mission.status === true
    );

    return missionsSuccess.map((mission) => mission.id);
  }, [missions]);
  const [missionSelected, setMissionSelected] = useState(null);
  const HandleSelectMission = async (select) => {
    const statusMission = select.some((item) => +item === +missionSelected.id);
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +missionSelected.work_id) {
        const updatedMissions = work.missions.map((mission) => {
          if (+mission.id === +missionSelected.id) {
            return { ...mission, status: statusMission };
          }
          return mission;
        });
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };

    updateMissionApi(missionSelected.id, { status: statusMission }).then(
      (data) => {
        if (data.status === 200) {
          dispatch(updateCard(updatedCard));
        } else {
          const error = data.error;
          toast.error(error);
        }
      }
    );
  };
  return (
    <div className="flex flex-col gap-3">
      <CheckboxGroup
        value={missionsSelected}
        onValueChange={(select) => {
          HandleSelectMission(select);
        }}
        className="select"
      >
        {missions?.map((mission) => (
          <Checkbox
            value={mission.id}
            key={mission.id}
            onClick={() => {
              setMissionSelected(mission);
            }}
          >
            <span className="text-xs">{mission.name}</span>
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  );
};
export default MissionsWork;
