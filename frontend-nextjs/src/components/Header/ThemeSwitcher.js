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
import { ThemeIcon } from "./ThemeIcons";
import classNames from "classnames";

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selectedKeys, setSelectedKeys] = useState(new Set([theme]));
  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setTheme(selectedValue);
  }, [selectedKeys, selectedValue]);

  if (!mounted) return null;

  return (
    <Dropdown className="change-mode">
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize min-w-5">
          <ThemeIcon theme={theme} item={theme} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Single selection example"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      >
        {["dark", "light", "system"].map((item) => (
          <DropdownItem
            key={item}
            className={classNames({
              "data-[selectable=true]:focus:text-sky-500":
                selectedValue === item,
              "text-sky-500": theme === item,
            })}
            startContent={<ThemeIcon item={item} theme={theme} />}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
