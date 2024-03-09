"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const BreadcrumbProfile = ({ options }) => {
  const pathname = usePathname();
  const router = useRouter();
  const check = options.some((option) => {
    return option.href.includes(pathname);
  });
  return check ? (
    <nav className="flex mt-4 ml-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {options?.map((option, index) => (
          <li key={index} className="">
            <div className="flex items-center">
              <span
                onClick={() => router.push(option.href)}
                className={`ms-3 text-base py-0.5  px-3 rounded-lg cursor-pointer ${
                  (
                    pathname === "/settings"
                      ? pathname.includes(option.href)
                      : option.href.includes(pathname)
                  )
                    ? "bg-default-100 text-black font-medium"
                    : " hover:text-default-900 text-default-400"
                }
                        `}
              >
                {option.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  ) : (
    ""
  );
};

export default BreadcrumbProfile;
