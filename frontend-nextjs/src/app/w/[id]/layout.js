import SidebarWorkspace from "./_components/SidebarWorkspace";
import BreadcrumbWorkspace from "./_components/BreadcrumbWorkspace";

export const metadata = {
  title: "Không gian làm việc ",
  description: "Chi tiết Không gian làm việc",
};
export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex gap-x-7 justify-center h-full ">
      <div className="shrink-0 h-full sm:block hidden">
        <SidebarWorkspace />
      </div>
      <div
        className="work-space grow mt-5 px-2 md:px-8 pr-4"
        style={{ maxHeight: "calc(100vh - 64px)", overflowX: "auto" }}
      >
        <BreadcrumbWorkspace origin={"Không gian làm việc"} />
        {children}
      </div>
    </div>
  );
}
