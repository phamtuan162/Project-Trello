"use client ";
import ActivityItem from "./activity-item";
const ActivityList = ({ activities }) => {
  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs  text-center text-muted-foreground">
        Không có hoạt động nào trong không gian làm việc
      </p>
      {activities?.map((activity) => (
        <ActivityItem activity={activity} />
      ))}
    </ol>
  );
};
export default ActivityList;
