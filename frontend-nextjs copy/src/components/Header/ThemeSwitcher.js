"use client";
import { useEffect, useState, useMemo } from "react";
import { useTheme } from "next-themes";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";
import { DarkIcon } from "./DarkIcon";
import { LightIcon } from "./LightIcon";
import { SystemIcon } from "./SystemIcon";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  // const [selectedKeys, setSelectedKeys] = useState(new Set(["light"]));
  // console.log(selectedKeys);
  // const selectedValue = useMemo(
  //   () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
  //   [selectedKeys]
  // );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <button onClick={setTheme()}>Dark</button>;
}
// <Dropdown>
//   <DropdownTrigger>
//     <Button variant="bordered" className="capitalize min-w-5">
//       {selectedValue === "dark" ? <DarkIcon /> : <LightIcon />}
//     </Button>
//   </DropdownTrigger>
//   <DropdownMenu
//     aria-label="Single selection example"
//     variant="flat"
//     disallowEmptySelection
//     selectionMode="single"
//     selectedKeys={selectedKeys}
//     onSelectionChange={setSelectedKeys}
//   >
//     <DropdownItem key="dark" startContent={<DarkIcon theme={theme} />}>
//       Dark icon
//     </DropdownItem>
//     <DropdownItem key="light" startContent={<LightIcon theme={theme} />}>
//       Light
//     </DropdownItem>
//     <DropdownItem key="system" startContent={<SystemIcon theme={theme} />}>
//       System
//     </DropdownItem>
//   </DropdownMenu>
// </Dropdown>
