"use client";
import { useState, useEffect } from "react";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { BoardIcon } from "@/components/Icon/BoardIcon";
import { DashBoardIcon } from "@/components/Icon/DashBoardIcon";

const options = [
  {
    href: "",
    key: "board",
    label: "Bảng Kanban",
    icon: <BoardIcon size={16} />,
  },
  {
    href: "/dashboard",
    key: "dashboard",
    label: "Báo cáo",
    icon: <DashBoardIcon size={16} />,
  },
];

const BreadcrumbsBoard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState("board");

  const board = useSelector((state) => state.board.board);

  useEffect(() => {
    const currentPath = pathname.includes("dashboard") ? "dashboard" : "board";
    setCurrentPage(currentPath);
  }, [pathname]);

  const handleAction = (key) => {
    const selectedOption = options.find((option) => option.key === key);

    if (selectedOption) {
      const targetPath = `/b/${board.id}${selectedOption.href}`;

      router.push(targetPath);
      setCurrentPage(key);
    }
  };

  return (
    <Breadcrumbs
      onAction={handleAction}
      classNames={{
        list: "gap-2",
      }}
      itemClasses={{
        item: [
          "p-1.5 rounded-md text-white ",
          "data-[current=true]:border-foreground data-[current=true]:bg-gray-200 data-[current=true]:text-indigo-950 transition-colors",
          "data-[disabled=true]:border-default-400 data-[disabled=true]:bg-gray-200 focus:outline-none",
        ],
        separator: "hidden",
      }}
    >
      {options.map((option) => (
        <BreadcrumbItem
          key={option.key}
          isCurrent={currentPage === option.key}
          className="option hidden sm:inline-block"
          startContent={option.icon}
        >
          {option.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default BreadcrumbsBoard;
