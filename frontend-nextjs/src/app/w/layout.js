import Sidebar from "@/components/Sidebar/Sidebar";
export default function WorkspaceLayout({ children }) {
  return (
    <div className="flex gap-x-7 justify-center">
      <Sidebar />
      <div className="work-space">{children}</div>
    </div>
  );
}
