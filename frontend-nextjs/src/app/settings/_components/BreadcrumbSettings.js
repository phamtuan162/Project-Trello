"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Settings, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

const BreadcrumbSettings = ({ options, origin }) => {
  const pathname = usePathname();
  const router = useRouter();
  const optionsSorted = options.filter((option) =>
    pathname.includes(option.href)
  );

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {optionsSorted?.map((optionSorted, index) =>
          index === 0 ? (
            <li
              key={index}
              className="inline-flex items-center cursor-pointer"
              onClick={() => {
                router.push(optionSorted.href);
              }}
            >
              <div className="inline-flex items-center text-base text-gray-700 gap-2 ">
                <div className="p-1 rounded-lg bg-default-300 flex items-center justify-center">
                  <Settings color="white" size={22} />
                </div>
                {origin}
              </div>
            </li>
          ) : (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRight size={16} />
                {optionSorted.icon}
                <span className="ms-1 text-base text-gray-700 ">
                  {optionSorted.label}
                </span>
              </div>
            </li>
          )
        )}
      </ol>
    </nav>
  );
};

export default BreadcrumbSettings;
