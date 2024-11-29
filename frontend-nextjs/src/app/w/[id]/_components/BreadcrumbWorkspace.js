"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { Avatar } from "@nextui-org/react";
import { useMemo } from "react";
const BreadcrumbWorkspace = ({ options }) => {
  const pathname = usePathname();
  const workspace = useSelector((state) => state.workspace.workspace);

  const optionsSorted = useMemo(() => {
    if (!options || options.length === 0) {
      return null;
    }
    return options.filter((option) => pathname.includes(option.href));
  }, [options]);

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center cursor-pointer">
          <div className="inline-flex items-center text-base text-gray-700 gap-2 ">
            <div className="p-1 rounded-lg  flex items-center justify-center">
              <Avatar
                style={{
                  background: `${
                    workspace && workspace.color ? workspace.color : "#9353D3"
                  }`,
                }}
                radius="md"
                size="md"
                className="h-8 text-lg text-white  w-8"
                name={workspace?.name?.charAt(0).toUpperCase()}
              />
            </div>
            <p className="max-w-[160px] sm:max-w-[400px]  truncate">
              {workspace?.name}{" "}
            </p>
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
