"use client";
import "react-image-crop/src/ReactCrop.scss";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { useState, useRef } from "react";
import { Avatar, Button, CircularProgress } from "@nextui-org/react";
import { CameraIcon, Check, Trash2 } from "lucide-react";
import setCanvasPreview from "@/utils/setCanvansPreview";
import { userSlice } from "@/stores/slices/userSlice";
import { updateAvatar } from "@/services/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
const { updateUser } = userSlice.actions;
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 200;
const FormUpdateAvatar = ({ user }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const imgRef = useRef(null);
  const [error, setError] = useState("");
  const [imgSrc, setImgSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpload, setIsUpload] = useState(false);

  const [crop, setCrop] = useState("");
  const handleUpload = async () => {
    setIsUpload(true);
    const { width: imgWidth, height: imgHeight } = imgRef.current;
    const canvas = document.createElement("canvas");

    setCanvasPreview(
      imgRef.current,
      canvas,
      convertToPixelCrop(crop, imgWidth, imgHeight)
    );

    const dataUrl = canvas.toDataURL("image/jpeg", 0.5);
    const blob = await fetch(dataUrl).then((res) => res.blob());
    const file = new File([blob], selectedFile.name, { type: "image/jpeg" });
    const formData = new FormData();
    formData.append("file", file);

    updateAvatar(user.id, formData).then((data) => {
      if (data.status === 200) {
        const user = data.user;
        dispatch(updateUser(user));
        setIsUpload(false);
        toast.success("Thay đổi avatar thành công");
        setImgSrc(null);
      }
    });
  };
  const onSelectFile = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;
      imageElement.addEventListener("load", (e) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 200 x 200 pixels.");
          return setImgSrc("");
        }
      });
      setImgSrc(imageUrl);
      setSelectedFile(file);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
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
        <div>
          <div
            onClick={() => {
              setIsOpen(false);
              setImgSrc(null);
              setCrop("");
            }}
            className=" fixed inset-0 bg-overlay/50 z-50"
          ></div>
          <div
            style={{ zIndex: "51" }}
            className="w-3/4 md:w-auto absolute top-1/2 left-1/2  bg-white p-7 md:px-14 rounded-2xl -translate-y-1/2 -translate-x-1/2"
          >
            <div className=" flex flex-col items-center ">
              <h2 className="text-3xl font-normal w-full text-center">
                Tải ảnh lên
              </h2>
              <div className="w-3/4 md:w-[300px] md:h-[300px] h-[200px]  mt-5 relative flex items-center justify-center ">
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  alt="Upload"
                  name="upl_avatar"
                  id="upl_avatar"
                  key={imgSrc}
                  onChange={(e) => onSelectFile(e)}
                />
                {imgSrc ? (
                  <ReactCrop
                    className="w-3/4 md:w-[300px] md:h-[300px] h-[200px] "
                    crop={crop}
                    onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                    circularCrop
                    aspect={ASPECT_RATIO}
                    minWidth={MIN_DIMENSION}
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      onLoad={(e) => onImageLoad(e)}
                      className="w-full rounded-xl h-full  object-cover text-9xl text-indigo-700  cursor-pointer   "
                    />
                  </ReactCrop>
                ) : (
                  <>
                    <label
                      htmlFor="upl_avatar"
                      className="bg-red-500  rounded-lg text-sm font-medium text-white mt-4 w-auto  flex items-center justify-center py-2 px-6 relative z-50 data-[hover=true]:opacity-100"
                    >
                      Choose File
                    </label>
                    <Avatar
                      src={user?.avatar}
                      className="w-full rounded-xl h-full  text-9xl text-indigo-700 bg-indigo-100 cursor-pointer absolute opacity-70 inset-0"
                      name={user?.name?.charAt(0).toUpperCase()}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 justify-center">
              <Button
                isDisabled={imgSrc && !isUpload ? false : true}
                type="button"
                className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full flex items-center justify-center px-0"
                color="danger"
                onClick={() => {
                  setImgSrc(null);
                  setCrop("");
                }}
              >
                {isUpload ? (
                  <CircularProgress aria-label="Loading..." size={24} />
                ) : (
                  <Trash2 size={24} />
                )}
              </Button>
              <Button
                isDisabled={imgSrc && !isUpload ? false : true}
                className=" text-xl font-medium text-white min-w-[50px] w-[50px] h-[50px]  min-h-[50px] rounded-full  flex items-center justify-center px-0"
                color="success"
                onClick={() => handleUpload()}
              >
                {isUpload ? (
                  <CircularProgress aria-label="Loading..." size={24} />
                ) : (
                  <Check size={24} />
                )}
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
