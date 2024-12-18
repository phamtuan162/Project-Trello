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
  isWithinInterval,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  addDays,
  compareAsc,
} from "date-fns";
import { useEffect, useRef, useState, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Checkbox,
  Input,
} from "@nextui-org/react";
import { toast } from "react-toastify";

import { CloseIcon } from "../../Icon/CloseIcon";
import { DateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { boardSlice } from "@/stores/slices/boardSlice";
import { validateHourMinute, truncateTimeFromDate } from "@/utils/formatTime";
import { socket } from "@/socket";

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

const { updateCard } = cardSlice.actions;
const { updateCardInBoard } = boardSlice.actions;

const SetDateCard = ({ children }) => {
  const dispatch = useDispatch();
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  let today = startOfToday();

  const [isOpen, setIsOpen] = useState(false);

  let [selectedDay, setSelectedDay] = useState(today);

  const [checkFocus, setCheckFocus] = useState("end");
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [startDateTime, setStartDateTime] = useState(
    card?.startDateTime ? new Date(card.startDateTime) : null
  );

  const [endDateTime, setEndDateTime] = useState(
    card?.endDateTime ? new Date(card.endDateTime) : addDays(today, 2)
  );

  const [isSelectEndTime, setIsSelectEndTime] = useState(true);
  const [isSelectStartTime, setIsSelectStartTime] = useState(
    Boolean(card?.startDateTime)
  );

  const inputRefStart = useRef(null);
  const inputRefEnd = useRef(null);

  const checkRole = useMemo(() => {
    const role = user?.role?.toLowerCase();
    return role === "admin" || role === "owner";
  }, [user?.role]);

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

  useEffect(() => {
    if (!isOpen) return;

    if (checkFocus === "start") {
      setStartDateTime(selectedDay);
    }
    if (checkFocus === "end") {
      setEndDateTime(selectedDay);
    }
  }, [selectedDay]);

  const CancelDate = async () => {
    try {
      await toast
        .promise(
          async () =>
            await DateCardApi(card.id, {
              startDateTime: null,
              endDateTime: null,
              status: null,
            }),
          { pending: "Đang gỡ bỏ..." }
        )
        .then((res) => {
          const { activity } = res;

          let cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            startDateTime: null,
            endDateTime: null,
            status: null,
          };

          if (activity) {
            cardUpdate.activities = [activity, ...card.activities];
          }

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Gỡ bỏ thành công");

          socket.emit("updateCard", cardUpdate);
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

    if (!startDateTime && !endDateTime) {
      CancelDate();
      return;
    }

    try {
      if (startDateTime && !isValid(startDateTime)) {
        toast.error("Ngày bắt đầu không hợp lệ!");
        return;
      }

      if (endDateTime && !isValid(endDateTime)) {
        toast.error("Ngày kết thúc không hợp lệ!");
        return;
      }

      if (startDateTime && compareAsc(startDateTime, new Date()) === -1) {
        // Kiểm tra ngày bắt đầu phải lớn hơn thời gian hiện tại
        toast.error("Ngày bắt đầu phải lớn hơn thời gian hiện tại!");
        return;
      }

      // Kiểm tra ngày kết thúc phải lớn hơn thời gian hiện tại
      if (endDateTime && compareAsc(endDateTime, new Date()) === -1) {
        toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        return;
      }

      // Kiểm tra ngày kết thúc phải lớn hơn ngày bắt đầu
      if (
        endDateTime &&
        startDateTime &&
        compareAsc(startDateTime, endDateTime) === 1
      ) {
        toast.error("Ngày kết thúc phải lớn hơn ngày bắt đầu!");
        return;
      }

      await toast
        .promise(
          async () =>
            await DateCardApi(card.id, {
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              status: "normal",
            }),
          { pending: "Đang cập nhật..." }
        )
        .then((res) => {
          const { activity } = res;

          let cardUpdate = {
            id: card.id,
            column_id: card.column_id,
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            status: "normal",
          };

          if (activity) {
            cardUpdate.activities = [activity, ...card.activities];
          }

          dispatch(updateCard(cardUpdate));

          dispatch(updateCardInBoard(cardUpdate));

          toast.success("Cập nhật thành công");

          socket.emit("updateCard", cardUpdate);
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

    const endDateTimeUpdate = new Date(endDateTime);

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
    setEndDateTime(endDateTimeUpdate);
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setSelectedDay(today);
    setStartDateTime(card.startDateTime ? new Date(card.startDateTime) : null);
    setEndDateTime(
      card.endDateTime ? new Date(card.endDateTime) : addDays(today, 2)
    );
    setCheckFocus("end");
  };
  return (
    <Popover
      placement="left"
      isOpen={isOpen}
      onClose={HandleReset}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className=" p-2 px-3 w-[300px] ">
        <div className=" max-h-[600px] overflow-x-auto w-full">
          <div className="flex justify-between items-center relative w-full pt-2">
            <h1 className="grow text-center ">Ngày</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto "
              onClick={HandleReset}
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
                            startDateTime &&
                              endDateTime &&
                              isWithinInterval(day, {
                                start: startDateTime,
                                end: endDateTime,
                              }) &&
                              "font-semibold bg-blue-100 ",
                            isEqual(day, new Date(startDateTime)) &&
                              "font-semibold bg-blue-100 text-indigo-400",
                            isEqual(
                              truncateTimeFromDate(day),
                              truncateTimeFromDate(new Date(endDateTime))
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
            <div className="w-full mt-3">
              <p className="text-xs font-medium">Ngày bắt đầu</p>
              <div className=" flex gap-2 ">
                <Checkbox
                  isSelected={isSelectStartTime}
                  onValueChange={(isSelect) => {
                    setIsSelectStartTime(isSelect);
                    if (!isSelect) {
                      setStartDateTime(null);
                      if (endDateTime) inputRefEnd.current.focus();
                    } else {
                      setStartDateTime(
                        card.startDateTime
                          ? new Date(card.startDateTime)
                          : today
                      );
                      inputRefStart.current.focus();
                    }
                  }}
                ></Checkbox>
                <Input
                  ref={inputRefStart}
                  type="text"
                  size="xs"
                  name="startTime"
                  variant={isSelectStartTime ? "bordered" : ""}
                  readOnly={!isSelectStartTime}
                  value={
                    isSelectEndTime && startDateTime
                      ? format(startDateTime, "dd/MM/yyyy")
                      : "N/T/NNNN"
                  }
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => setCheckFocus("start")}
                />
              </div>
            </div>
            <div className="w-full mt-2">
              <p className="text-xs font-medium">Ngày hết hạn</p>
              <div className=" flex gap-2 ">
                <Checkbox
                  isSelected={isSelectEndTime}
                  onValueChange={(isSelect) => {
                    setIsSelectEndTime(isSelect);
                    if (!isSelect) {
                      setEndDateTime(null);
                      if (startDateTime) inputRefStart.current.focus();
                    } else {
                      setEndDateTime(
                        card.endDateTime
                          ? new Date(card.endDateTime)
                          : addDays(today, 2)
                      );
                      inputRefEnd.current.focus();
                    }
                  }}
                ></Checkbox>
                <Input
                  ref={inputRefEnd}
                  type="text"
                  size="xs"
                  name="endTime"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={!isSelectEndTime}
                  value={
                    isSelectEndTime && endDateTime
                      ? format(endDateTime, "dd/MM/yyyy")
                      : "N/T/NNNN"
                  }
                  onChange={(e) => {
                    setEndDateTime(e.target.value);
                  }}
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => setCheckFocus("end")}
                />
                <Input
                  type="time"
                  size="xs"
                  name="endTimeHour"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={!isSelectEndTime}
                  value={
                    isSelectEndTime ? format(endDateTime, "HH:mm") : "GG:pp"
                  }
                  className={`w-auto focus-visible:outline-0  p-1 rounded-md`}
                  onChange={handleTimeChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full mt-3 interceptor-loading"
              isDisabled={!checkRole}
            >
              Lưu
            </Button>
            <Button
              onClick={() => CancelDate()}
              type="button"
              className="w-full mt-1 bg-gray-200 interceptor-loading"
              isDisabled={!checkRole}
            >
              Gỡ bỏ
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SetDateCard;
