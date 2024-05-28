export const metadata = {
  title: "Bảng | ProManage",
  description: "Chi tiết Bảng",
};
import BoardNavbar from "./_components/BoardNavbar";
export default function BoardLayout({ children }) {
  return (
    <div className="relative h-full flex">
      <BoardNavbar />
      {children}
    </div>
  );
}
