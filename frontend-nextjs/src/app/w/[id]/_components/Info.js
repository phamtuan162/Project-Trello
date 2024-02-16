"use client";
import Image from "next/image";
import { PrivateIcon } from "@/components/Icon/PrivateIcon";
export function Info({ workspace }) {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          alt="Workspace"
          className="rounded-md object-cover"
          src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          sizes="sm"
        />
      </div>
      <div className="space-y-1">
        <p className="font-semibold text-xl">{workspace?.name}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <PrivateIcon />
        </div>
      </div>
    </div>
  );
}
