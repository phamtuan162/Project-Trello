"use client ";
import ActivityItem from "./activity-item";
const ActivityList = ({ activities }) => {
  return (
    <ol className="space-y-4 mt-4 pb-2">
      <p className="hidden last:block text-xs  text-center text-muted-foreground">
        Không có hoạt động nào
      </p>
      {activities?.length > 0 &&
        activities.map((activity) => (
          <ActivityItem activity={activity} key={activity.id} />
        ))}
    </ol>
  );
};
export default ActivityList;
