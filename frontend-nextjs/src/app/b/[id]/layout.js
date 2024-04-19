export const metadata = {
  title: "Bảng",
  description: "Chi tiết Bảng",
};
export default function BoardLayout({ children }) {
  return <div className="relative h-full flex">{children}</div>;
}
