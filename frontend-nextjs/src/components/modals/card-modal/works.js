"use client";
import { useSelector } from "react-redux";
import WorkCard from "./work";
const WorksCard = () => {
  const card = useSelector((state) => state.card.card);
  return (
    <div className="flex flex-col gap-8">
      {card?.works?.map((work) => (
        <WorkCard work={work} key={work.id} />
      ))}
    </div>
  );
};
export default WorksCard;
