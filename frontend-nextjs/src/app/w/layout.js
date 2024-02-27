import Sidebar from "@/components/Sidebar/Sidebar";
export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex gap-x-7 justify-center h-full ">
      <Sidebar />
      <div
        className="work-space grow  "
        style={{ maxHeight: "calc(100vh - 64px)", overflow: "auto" }}
      >
        {children}
      </div>
    </div>
  );
}
