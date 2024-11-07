"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { useSelector } from "react-redux";
const PageBilling = () => {
  const user = useSelector((state) => state.user.user);
  return (
    <div className="mt-2">
      <h1 className="text-2xl font-medium">Thanh toán</h1>
      <p className="mt-1">
        Quản lý tất cả không gian làm việc của bạn trong một gói đăng ký. Khám
        phá những lợi ích của
        <span className="text-red-500 ml-1 font-semibold">
          Gói cao cấp tất cả trong một của chúng tôi
        </span>
        .
      </p>
      <Table
        classNames={{
          th: [
            "bg-transparent",
            "text-default-500",
            "border-b",
            "border-divider",
          ],
        }}
        removeWrapper
        aria-label="Example static collection table"
        className="mt-4"
      >
        <TableHeader>
          <TableColumn>KHÔNG GIAN LÀM VIỆC</TableColumn>
          <TableColumn className="hidden md:flex items-center">
            KẾ HOẠCH
          </TableColumn>
          <TableColumn>CÁC THÀNH VIÊN</TableColumn>
          <TableColumn>HÀNH ĐỘNG</TableColumn>
        </TableHeader>
        <TableBody>
          {user?.workspaces?.map((workspace) => (
            <TableRow
              className="border-b border-divider h-[70px]"
              key={workspace.id}
            >
              <TableCell>{workspace.name}</TableCell>
              <TableCell className="hidden md:flex mt-4 ">Free</TableCell>
              <TableCell>{workspace.total_user} thành viên</TableCell>
              <TableCell>
                <Button
                  type="button"
                  className="rounded-lg h-full py-1.5 text-red-600 bg-red-100 font-medium"
                  onClick={() => handleLogoutDevice()}
                >
                  Nâng cấp
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
export default PageBilling;
