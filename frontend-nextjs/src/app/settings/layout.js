import SidebarSettings from "./_components/SidebarSettings";
import BreadcrumbSettings from "./_components/BreadcrumbSettings";
export default function SettingsLayout({ children }) {
  return (
    <div className=" h-full flex">
      <SidebarSettings />

      <div className="grow">
        <BreadcrumbSettings />
        <div>{children}</div>
      </div>
    </div>
  );
}
