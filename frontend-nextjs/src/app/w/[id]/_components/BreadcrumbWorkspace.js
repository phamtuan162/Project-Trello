"use client";
import React from "react";
import { ChevronRight } from "lucide-react";
import { usePathname, useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";
const BreadcrumbWorkspace = ({ options, origin }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { id: workspaceId } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);
  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );
  const optionsSorted = options.filter((option) =>
    pathname.includes(option.href)
  );

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center cursor-pointer">
          <div className="inline-flex items-center text-base text-gray-700 gap-2 ">
            <div className="p-1 rounded-lg  flex items-center justify-center">
              <Avatar
                src={workspace?.avatar}
                radius="md"
                size="md"
                className="h-8 text-lg text-indigo-700 bg-indigo-100 w-8"
                name={workspace?.name?.charAt(0).toUpperCase()}
              />
            </div>
            {workspace?.name}
          </div>
        </li>
        {optionsSorted?.map((optionSorted, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight size={17} />
              <span className="ms-1 text-base text-gray-700 flex gap-1 items-center">
                {optionSorted.icon}
                {optionSorted.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbWorkspace;
