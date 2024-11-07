"use client";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading/Loading";
import FormDeleteUser from "./_components/FormDeleteUser";
import FormUpdateProfile from "./_components/FormUpdateProfile";
import FormLinkPhoneNumber from "./_components/FormLinkPhoneNumber";
const PageSettings = () => {
  const user = useSelector((state) => state.user.user);

  if (!user?.id) {
    return <Loading />;
  }

  return (
    <div className="mt-6">
      <FormUpdateProfile user={user} />
      <FormLinkPhoneNumber user={user} />
      {user?.provider?.toLowerCase() !== "github" && (
        <FormDeleteUser user={user} />
      )}
    </div>
  );
};
export default PageSettings;
