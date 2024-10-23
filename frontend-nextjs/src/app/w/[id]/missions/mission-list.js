"use client";
import MissionItem from "./mission-item";

const MissionList = ({ missions }) => {
  return (
    <ol className="space-y-4 mt-4 pb-4">
      <p className="hidden last:block text-xs  text-center text-muted-foreground">
        Không có nhiệm vụ nào trong không gian làm việc
      </p>
      {missions?.map((mission) => (
        <MissionItem key={mission.id} mission={mission} />
      ))}
    </ol>
  );
};

export default MissionList;
