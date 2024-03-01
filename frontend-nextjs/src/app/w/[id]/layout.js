import SidebarWorkspace from "./_components/SidebarWorkspace";
export const metadata = {
  title: "Workspace ",
  description: "Workspace detail",
};
export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex gap-x-7 justify-center h-full ">
      <SidebarWorkspace />
      <div
        className="work-space grow  "
        style={{ maxHeight: "calc(100vh - 64px)", overflow: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
