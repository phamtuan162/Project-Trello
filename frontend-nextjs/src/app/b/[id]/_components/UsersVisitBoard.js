"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import { useDispatch } from "react-redux";

import { socket } from "@/socket";

const UsersVisitBoard = () => {
  const dispatch = useDispatch();
  const [usersVisit, setUsersVisit] = useState([]);

  const handleUserVisitBoard = (data) => {
    if (data?.length) setUsersVisit(data);
  };

  useEffect(() => {
    socket.on("getUserVisitBoard", handleUserVisitBoard);

    return () => {
      socket.off("getUserVisitBoard", handleUserVisitBoard);
    };
  }, [dispatch]);

  return (
    <AvatarGroup isBordered max={2} className="group-avatar-1">
      {usersVisit?.map((user) => (
        <Avatar
          key={user?.id}
          src={user?.avatar}
          name={user?.name?.charAt(0).toUpperCase()}
          color="secondary"
        />
      ))}
    </AvatarGroup>
  );
};
export default UsersVisitBoard;
