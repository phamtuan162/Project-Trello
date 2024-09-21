"use client";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading/Loading";
import FormDeleteUser from "./_components/FormDeleteUser";
import FormUpdateProfile from "./_components/FormUpdateProfile";

const PageSettings = () => {
  const user = useSelector((state) => state.user.user);

  return user.id ? (
    <div className="mt-6">
      <FormUpdateProfile user={user} />
      <FormDeleteUser user={user} />
    </div>
  ) : (
    <Loading />
  );
};
export default PageSettings;
