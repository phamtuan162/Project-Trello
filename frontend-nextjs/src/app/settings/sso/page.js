"use client";
import { useState } from "react";
import { Switch, cn } from "@nextui-org/react";
import { useSelector } from "react-redux";
import { GoogleIcon } from "@/components/Icon/GoogleIcon";
import { GithubIcon } from "@/components/Icon/GithubIcon";
const PageSSO = () => {
  const user = useSelector((state) => state.user.user);
  const providers = useSelector((state) => state.provider.providers);
  console.log(user, providers);
  const listSso = [
    {
      label: "Google",
      desc: "Đăng nhập một lần bằng Google",
      icon: <GoogleIcon size={28} />,
    },
    {
      label: "Github",
      desc: "Đăng nhập một lần bằng Github",
      icon: <GithubIcon size={28} />,
    },
  ];

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-medium mt-2">Tài khoản được kết nối</h1>
      <p className="mt-1">
        Kết nối các kết nối xã hội của bạn như Google hoặc Github.
      </p>
      {listSso.map((sso, index) => (
        <div className="mt-3" key={index}>
          <Switch
            isSelected={
              providers?.length > 0
                ? providers?.some(
                    (provider) => provider.name === sso.label.toLowerCase()
                  )
                : false
            }
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                "data-[selected=true]:border-primary"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                "group-data-[selected=true]:ml-6",
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4"
              ),
            }}
          >
            <div className="flex items-center gap-2">
              {sso.icon}
              <div className="flex flex-col gap-1">
                <p className="text-medium">
                  {sso.label}: {user.name}
                </p>
                <p className="text-tiny text-default-400">{sso.desc}</p>
              </div>
            </div>
          </Switch>
        </div>
      ))}
    </div>
  );
};
export default PageSSO;
