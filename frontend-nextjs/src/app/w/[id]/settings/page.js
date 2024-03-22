"use client";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { Link } from "@nextui-org/react";
import Loading from "@/components/Loading/Loading";
import FormDeleteWorkspace from "../_components/FormDeleteWorkspace";
import FormUpdateWorkspace from "../_components/formUpdateWorkspace";
export default function pageWorkspaceSetting() {
  const { id: workspaceId } = useParams();
  const workspaces = useSelector((state) => state.workspace.workspaces);

  const workspace = workspaces?.find(
    (workspace) => workspace.id === +workspaceId
  );

  return workspace ? (
    <div className="pb-6">
      <div className="border-b-1 border-solid border-default-400 w-full pb-6 mt-4">
        <span className=" uppercase text-default-400 font-normal text-sm">
          Kế hoạch
        </span>
        <h2 className="text-xl font-medium mt-3 ">Gói miễn phí</h2>
        <p className="mt-1 max-w-[500px]">
          Khám phá những lợi ích của
          <Link style={{ color: "rgb(249, 214, 0)" }} className="mx-1">
            Gói cao cấp tất cả trong một của chúng tôi
          </Link>
        </p>
      </div>

      <FormUpdateWorkspace workspace={workspace} workspaces={workspaces} />
      <FormDeleteWorkspace workspace={workspace} />
    </div>
  ) : (
    <Loading backgroundColor={"white"} zIndex={"100"} />
  );
}
