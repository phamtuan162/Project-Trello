"use client";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isValid,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  addDays,
  compareAsc,
} from "date-fns";
import { useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Input,
} from "@nextui-org/react";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";

import { CloseIcon } from "@/components/Icon/CloseIcon";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { missionSlice } from "@/stores/slices/missionSlice";
import { validateHourMinute, truncateTimeFromDate } from "@/utils/formatTime";
import { updateMissionApi } from "@/services/workspaceApi";

const { updateMissionInCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;
const { updateMissionInMissions } = missionSlice.actions;

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const SetDate = ({ children, mission }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);

  let today = startOfToday();
  const [isOpen, setIsOpen] = useState(false);
  let [selectedDay, setSelectedDay] = useState(
    mission?.endDateTime ? new Date(mission?.endDateTime) : addDays(today, 1)
  );

  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [isSelectEndTime, setIsSelectEndTime] = useState(true);

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  const CancelDate = async () => {
    if (!mission.endDateTime) {
      toast.error("Không có ngày hết hạn nên không thể gỡ bỏ!");
      return;
    }

    try {
      await toast
        .promise(
          async () =>
            await updateMissionApi(mission.id, {
              endDateTime: null,
            }),
          { pending: "Đang gỡ bỏ..." }
        )
        .then((res) => {
          const works = cloneDeep(card.works);

          const work = works.find((w) => w.id === mission.work_id);

          const missionUpdate = work?.missions.find((m) => m.id === mission.id);

          if (mission) {
            missionUpdate.endDateTime = null;
          }

          dispatch(
            updateMissionInCard({
              id: mission.id,
              work_id: mission.work_id,
              endDateTime: null,
            })
          );

          dispatch(
            updateCardInBoard({ id: card.id, column_id: card.column_id, works })
          );

          toast.success("Gỡ bỏ thành công");

          if (mission.user_id === user.id) {
            dispatch(
              updateMissionInMissions({ id: mission.id, endDateTime: null })
            );
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateDate = async (e) => {
    e.preventDefault();
    try {
      // Kiểm tra ngày/tháng/năm không hợp lệ
      let endDateTimeUpdate = selectedDay;

      if (!endDateTimeUpdate) {
        CancelDate();
        return;
      }

      if (endDateTimeUpdate && !isValid(endDateTimeUpdate)) {
        toast.error("Ngày tháng năm không hợp lệ!");
        return;
      }

      if (
        endDateTimeUpdate &&
        isEqual(endDateTimeUpdate, new Date(mission.endDateTime))
      ) {
        toast.error("Ngày kết thúc không thay đổi.");
        return;
      }

      // Kiểm tra ngày đầu phải lớn hơn thời gian hiện tại
      if (
        endDateTimeUpdate &&
        compareAsc(endDateTimeUpdate, new Date()) === -1
      ) {
        toast.error("Ngày hết hạn phải lớn hơn thời gian hiện tại!");
        return;
      }

      await toast
        .promise(
          async () =>
            await updateMissionApi(mission.id, {
              endDateTime: endDateTimeUpdate,
            }),
          { pending: "Đang cập nhật..." }
        )
        .then((res) => {
          const works = cloneDeep(card.works);

          const work = works.find((w) => w.id === mission.work_id);

          const missionUpdate = work?.missions.find((m) => m.id === mission.id);

          if (missionUpdate) {
            missionUpdate.endDateTime = endDateTimeUpdate.toISOString();
          }

          dispatch(
            updateMissionInCard({
              id: mission.id,
              work_id: mission.work_id,
              endDateTime: endDateTimeUpdate.toISOString(),
            })
          );

          dispatch(
            updateCardInBoard({ id: card.id, column_id: card.column_id, works })
          );

          if (mission.user_id === user.id) {
            dispatch(
              updateMissionInMissions({
                id: mission.id,
                endDateTime: endDateTimeUpdate.toISOString(),
              })
            );
          }

          toast.success("Cập nhật thành công");
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setIsOpen(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleTimeChange = (e) => {
    const endDateHour = e.target.value;

    const endDateTimeUpdate = new Date(selectedDay);

    // Tách giờ và phút
    const [hour, minute] = endDateHour.split(":");

    // Kiểm tra giờ và phút có hợp lệ không
    if (!validateHourMinute(hour, minute)) {
      toast.error("Giờ phút không hợp lệ!");
      return;
    }

    // Chuyển giờ và phút thành số trước khi sử dụng setHours và setMinutes
    const hourNumber = parseInt(hour, 10);
    const minuteNumber = parseInt(minute, 10);

    // Cập nhật giờ phút vào đối tượng Date
    endDateTimeUpdate.setHours(hourNumber, minuteNumber);

    // Cập nhật state
    setSelectedDay(endDateTimeUpdate);
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setSelectedDay(
      mission?.endDateTime ? new Date(mission?.endDateTime) : addDays(today, 1)
    );
    setIsSelectEndTime(true);
  };

  return (
    <Popover
      placement="right"
      onClose={HandleReset}
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (
          user.role.toLowerCase() === "admin" ||
          user.role.toLowerCase() === "owner"
        ) {
          setIsOpen(open);
        } else {
          toast.error("Bạn không đủ quyền thực hiện thao tác này");
        }
      }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className=" p-2 px-3 w-[300px] ">
        <div className=" max-h-[600px] overflow-x-auto w-full">
          <div className="flex justify-between items-center relative w-full pt-2">
            <h1 className="grow text-center ">Sửa ngày hết hạn</h1>
            <Button
              onClick={() => HandleReset()}
              className="interceptor-loading min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto "
              variant="ghost"
            >
              <CloseIcon />
            </Button>
          </div>
          <div className="mt-4 w-full">
            <div className=" px-4 mx-auto sm:px-7 w-full md:px-6 ">
              <div className=" md:divide-x md:divide-gray-200">
                <div className="">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={previousMonth}
                      className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Previous month</span>
                      <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <h2 className="flex-auto font-semibold text-gray-900 text-center">
                      {format(firstDayCurrentMonth, "MMMM yyyy")}
                    </h2>
                    <button
                      onClick={nextMonth}
                      type="button"
                      className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Next month</span>
                      <ChevronRightIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mt-1 text-sm gap-1">
                    {days.map((day, dayIdx) => (
                      <div
                        key={day.toString()}
                        className={classNames(
                          dayIdx === 0 && colStartClasses[getDay(day)],
                          "py-1"
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDay(day);
                          }}
                          className={classNames(
                            isEqual(day, selectedDay) && "text-blue-500  ",
                            !isEqual(day, selectedDay) &&
                              isToday(day) &&
                              "text-blue-500 underline",
                            !isEqual(day, selectedDay) &&
                              !isToday(day) &&
                              isSameMonth(day, firstDayCurrentMonth) &&
                              "text-gray-500",
                            !isEqual(day, selectedDay) &&
                              !isToday(day) &&
                              !isSameMonth(day, firstDayCurrentMonth) &&
                              "text-gray-400",
                            isEqual(day, selectedDay) &&
                              isToday(day) &&
                              " underline",
                            isEqual(day, selectedDay) &&
                              !isToday(day) &&
                              "bg-blue-100",
                            !isEqual(day, selectedDay) &&
                              "hover:bg-default-200",
                            (isEqual(day, selectedDay) || isToday(day)) &&
                              "font-semibold",

                            isEqual(
                              truncateTimeFromDate(day),
                              truncateTimeFromDate(new Date(selectedDay))
                            ) && "font-semibold bg-blue-100 text-indigo-400",
                            "mx-auto flex h-8 w-full items-center justify-center rounded-md"
                          )}
                        >
                          <time dateTime={format(day, "yyyy-MM-dd")}>
                            {format(day, "d")}
                          </time>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={UpdateDate}>
            <div className="w-full mt-2">
              <p className="text-xs font-medium">Ngày hết hạn</p>
              <div className=" flex gap-1 items-center">
                <input
                  type="checkbox"
                  className="w-[16px] h-[16px]"
                  checked={isSelectEndTime}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setIsSelectEndTime(isChecked);
                    if (!isChecked) {
                      setSelectedDay(null);
                    } else {
                      setSelectedDay(
                        mission?.endDateTime
                          ? new Date(mission?.endDateTime)
                          : addDays(today, 1)
                      );
                    }
                  }}
                />

                <Input
                  type="datetime"
                  size="xs"
                  name="endTime"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={!isSelectEndTime}
                  value={
                    isSelectEndTime
                      ? format(selectedDay, "dd/MM/yyyy")
                      : "N/T/NNNN"
                  }
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                />
                <Input
                  type="time"
                  size="xs"
                  name="endTimeHour"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={!isSelectEndTime}
                  value={
                    isSelectEndTime ? format(selectedDay, "HH:mm") : "GG:pp"
                  }
                  className={`w-auto focus-visible:outline-0  p-1 rounded-md`}
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full mt-3 font-medium interceptor-loading"
            >
              Lưu
            </Button>
            <Button
              onClick={CancelDate}
              type="button"
              className="w-full mt-1 bg-gray-200  font-medium interceptor-loading"
            >
              Gỡ bỏ
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default SetDate;
