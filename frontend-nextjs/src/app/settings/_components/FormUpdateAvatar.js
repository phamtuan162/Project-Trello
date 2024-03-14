"use client";
import { useState } from "react";
import {
  Avatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
} from "@nextui-org/react";

import { CameraIcon, Check, Trash2 } from "lucide-react";
const FormUpdateAvatar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const HandleUpdateFileImage = async () => {
    console.log(1);
  };
  return (
    <div>
      <div
        onClick={() => setIsOpen(true)}
        className=" mt-1 flex relative h-[100px] w-[100px] rounded-full overflow-hidden cursor-pointer"
      >
        <div
          className=" flex flex-col w-full h-full items-center justify-center absolute text-white  bg-overlay/70 text-xs z-50 opacity-0 hover:opacity-100"
          style={{
            transition: "opacity 200ms ease-in 0s",
          }}
        >
          <CameraIcon />
          Tải ảnh lên
        </div>
        <Avatar
          src={user?.avatar}
          radius="full"
          className="w-full h-full  text-4xl text-indigo-700 bg-indigo-100 cursor-pointer "
          name={user?.name?.charAt(0).toUpperCase()}
        />
      </div>
      {isOpen ? (
        <div
          className=" fixed inset-0 bg-overlay/50 z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            style={{ zIndex: "51" }}
            className="w-3/4 md:w-auto absolute top-1/2 left-1/2  bg-white p-7 md:px-14 rounded-2xl -translate-y-1/2 -translate-x-1/2"
          >
            <div className=" flex flex-col items-center ">
              <h2 className="text-3xl font-normal w-full text-center">
                Tải ảnh lên
              </h2>
              <div className="w-3/4 md:w-[300px] md:h-[300px] h-[200px]  mt-5 relative flex items-center justify-center ">
                <Button
                  onClick={HandleUpdateFileImage}
                  type="button"
                  className="rounded-2xl text-sm font-medium text-white mt-4 w-auto  flex items-center justify-center py-2 relative z-50 data-[hover=true]:opacity-100"
                  color="danger"
                >
                  Choose File
                </Button>
                <Avatar
                  src={user?.avatar}
                  className="w-full rounded-xl h-full  text-9xl text-indigo-700 bg-indigo-100 cursor-pointer absolute opacity-50 inset-0"
                  name={user?.name?.charAt(0).toUpperCase()}
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 justify-center">
              <Button
                type="button"
                className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full flex items-center justify-center px-0"
                color="danger"
              >
                <Trash2 size={24} />
              </Button>
              <Button
                type="button"
                className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full  flex items-center justify-center px-0"
                color="success"
              >
                <Check size={24} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
export default FormUpdateAvatar;
// <Popover
// isOpen={isOpen}
// onOpenChange={(open) => {
//   setIsOpen(open);
// }}
// placement=""
// style={{
//   top: "50%",
// }}
// backdrop="opaque"
// classNames={{
//   base: ["-translate-y-1/2  "],
//   content: ["py-4 px-12 border border-default-200 rounded-3xl "],
// }}
// >
// <PopoverTrigger>
//   <div className=" mt-1 flex relative h-[100px] w-[100px] rounded-full overflow-hidden cursor-pointer">
//     <div
//       className=" flex flex-col w-full h-full items-center justify-center absolute text-white  bg-overlay/70 text-xs z-50 opacity-0 hover:opacity-100"
//       style={{
//         transition: "opacity 200ms ease-in 0s",
//       }}
//     >
//       <CameraIcon />
//       Tải ảnh lên
//     </div>
//     <Avatar
//       src={user?.avatar}
//       radius="full"
//       className="w-full h-full  text-4xl text-indigo-700 bg-indigo-100 cursor-pointer "
//       name={user?.name?.charAt(0).toUpperCase()}
//     />
//   </div>
// </PopoverTrigger>
// <PopoverContent className=" w-full ">
//   <div className=" h-full w-full ">
//     <div className=" flex flex-col items-center">
//       <h2 className="text-3xl font-normal w-full text-center">
//         Tải ảnh lên
//       </h2>
//       <div className="w-[300px] h-[300px]  mt-5 relative flex items-center justify-center ">
//         <Button
//           onClick={HandleUpdateFileImage}
//           type="button"
//           className="rounded-2xl text-sm font-medium text-white mt-4 w-auto  flex items-center justify-center py-2 relative z-50 data-[hover=true]:opacity-100"
//           color="danger"
//         >
//           Choose File
//         </Button>
//         <Avatar
//           src={user?.avatar}
//           className="w-full rounded-xl h-full  text-9xl text-indigo-700 bg-indigo-100 cursor-pointer absolute opacity-50 inset-0"
//           name={user?.name?.charAt(0).toUpperCase()}
//         />
//       </div>
//     </div>

//     <div className="flex items-center gap-3 mt-4 justify-center">
//       <Button
//         type="button"
//         className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full flex items-center justify-center px-0"
//         color="danger"
//       >
//         <Trash2 size={24} />
//       </Button>
//       <Button
//         type="button"
//         className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full  flex items-center justify-center px-0"
//         color="success"
//       >
//         <Check size={24} />
//       </Button>
//     </div>
//   </div>
// </PopoverContent>
// </Popover>
