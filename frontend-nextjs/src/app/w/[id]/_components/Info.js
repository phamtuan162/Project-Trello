"use client";
import { Avatar } from "@nextui-org/react";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
export function Info({ workspace }) {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[48px] h-[48px] relative">
        <Avatar
          fill
          alt="Workspace"
          src={workspace?.avatar}
          radius="md"
          className=" w-12 h-12 text-lg text-indigo-700 bg-indigo-100  object-cover"
          name={workspace?.name?.charAt(0).toUpperCase()}
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-md">{workspace?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <PrivateIcon />
        </div>
      </div>
    </div>
  );
}
