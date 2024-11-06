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
  startOfWeek,
  subDays,
  addDays,
  compareAsc,
  addWeeks,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Checkbox,
  Input,
} from "@nextui-org/react";
import { CloseIcon } from "../Icon/CloseIcon";
import { DateCardApi } from "@/services/workspaceApi";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
import { Message } from "../Message/Message";
function truncateTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
const { updateCard } = cardSlice.actions;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const validateHourMinute = (hour, minute) => {
  return (
    parseInt(hour) >= 0 &&
    parseInt(hour) <= 23 &&
    parseInt(minute) >= 0 &&
    parseInt(minute) <= 59
  );
};
const FormDate = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  let today = startOfToday();

  let [selectedDay, setSelectedDay] = useState(today);
  const [checkFocus, setCheckFocus] = useState("");
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [startDateTime, setStartDateTime] = useState(
    card.startDateTime ? new Date(card.startDateTime) : null
  );

  const [endDateTime, setEndDateTime] = useState(
    card.endDateTime
      ? new Date(card.endDateTime)
      : addWeeks(startOfWeek(today, { weekStartsOn: 1 }), 1)
  );

  const [isSelectEndTime, setIsSelectEndTime] = useState(true);
  const [isSelectStartTime, setIsSelectStartTime] = useState(
    card?.startDateTime
  );
  const inputRefStart = useRef(null);
  const inputRefEnd = useRef(null);
  const inputRefEndHour = useRef(null);

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
    if (checkFocus === "start") {
      if (endDateTime && compareAsc(selectedDay, endDateTime) === 1) {
        setEndDateTime(addDays(selectedDay, 1));
      }
      setStartDateTime(selectedDay);
    }
    if (checkFocus === "end") {
      if (startDateTime && compareAsc(selectedDay, startDateTime) === -1) {
        setStartDateTime(subDays(selectedDay, 1));
      }
      setEndDateTime(selectedDay);
    }
  }, [selectedDay]);

  const UpdateDate = async (formData) => {
    const startDate = formData.get("startTime");
    const endDate = formData.get("endTime");
    const endDateHour = formData.get("endTimeHour");

    // Kiểm tra ngày/tháng/năm không hợp lệ
    const startDateTimeUpdate = startDateTime
      ? parse(startDate, "dd/MM/yyyy", new Date())
      : startDateTime;
    let endDateTimeUpdate = endDateTime
      ? parse(endDate, "dd/MM/yyyy", new Date())
      : endDateTime;
    if (
      (startDateTimeUpdate && !isValid(startDateTimeUpdate)) ||
      (endDateTimeUpdate && !isValid(endDateTimeUpdate))
    ) {
      setMessage("Ngày tháng năm không hợp lệ!");
      return;
    }

    // Kiểm tra giờ/phút không hợp lệ
    if (endDateTimeUpdate && endDateHour) {
      const [hour, minute] = endDateHour.split(":");
      if (!validateHourMinute(hour, minute)) {
        setMessage("Giờ phút không hợp lệ!");
        inputRefEndHour.current.focus();
        return;
      }
      endDateTimeUpdate.setHours(hour);
      endDateTimeUpdate.setMinutes(minute);
    }

    // Kiểm tra ngày đầu phải lớn hơn thời gian hiện tại
    if (
      startDateTimeUpdate &&
      compareAsc(startDateTimeUpdate, new Date()) === -1
    ) {
      setMessage("Ngày bắt đầu phải lớn hơn thời gian hiện tại!");
      return;
    }

    // Kiểm tra ngày cuối phải lớn hơn ngày đầu
    if (
      endDateTimeUpdate &&
      compareAsc(startDateTimeUpdate, endDateTimeUpdate) === 1
    ) {
      setMessage("Ngày kết thúc phải lớn hơn ngày đầu!");
      return;
    }

    try {
      const data = await DateCardApi(card.id, {
        startDateTime: startDateTimeUpdate,
        endDateTime: endDateTimeUpdate,
        status: "pending",
      });

      const { status, data: updatedData } = data;
      if (status === 200) {
        const cardUpdate = {
          ...card,
          startDateTime: updatedData.startDateTime,
          endDateTime: updatedData.endDateTime,
          activities: updatedData.activities,
          status: "pending",
        };
        dispatch(updateCard(cardUpdate));
        setIsOpen(false);
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const CancelDate = async () => {
    try {
      const data = await DateCardApi(card.id, {
        startDateTime: null,
        endDateTime: null,
        status: null,
      });

      const { status, data: updatedData } = data;
      if (status === 200) {
        const cardUpdate = {
          ...card,
          startDateTime: null,
          endDateTime: null,
          activities: data.data.activities,
          status: null,
        };
        dispatch(updateCard(cardUpdate));
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setCheckFocus("");
    setMessage("");
    setSelectedDay(card.startDateTime || card.endDateTime || today);
    setStartDateTime(card.startDateTime ? new Date(card.startDateTime) : null);
    setEndDateTime(
      card.endDateTime
        ? new Date(card.endDateTime)
        : addWeeks(startOfWeek(today, { weekStartsOn: 1 }), 1)
    );
  };
  return (
    <Popover
      placement="right"
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
              onClick={() => HandleReset()}
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
                            if (checkFocus === "start") {
                              inputRefStart.current.focus();
                            } else if (checkFocus === "end") {
                              inputRefEnd.current.focus();
                            } else {
                              inputRefEnd.current.focus();
                            }
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

          <form action={UpdateDate}>
            <Message message={message} />
            <div className="w-full mt-3">
              <p className="text-xs font-medium">Ngày bắt đầu</p>
              <div className=" flex gap-2 ">
                <Checkbox
                  isSelected={isSelectStartTime}
                  onValueChange={(isSelect) => {
                    setIsSelectStartTime(isSelect);
                    if (!isSelect) {
                      setStartDateTime(null);
                    } else {
                      setStartDateTime(
                        card.startDateTime
                          ? new Date(card.startDateTime)
                          : today
                      );
                    }
                    inputRefStart.current.focus();
                  }}
                ></Checkbox>
                <Input
                  ref={inputRefStart}
                  type="text"
                  size="xs"
                  name="startTime"
                  variant={isSelectStartTime ? "bordered" : ""}
                  readOnly={isSelectStartTime ? false : true}
                  value={
                    isSelectStartTime && startDateTime
                      ? isValid(startDateTime)
                        ? format(startDateTime, "dd/MM/yyyy")
                        : startDateTime
                      : "N/T/NNNN"
                  }
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onChange={(e) => setStartDateTime(e.target.value)}
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
                    } else {
                      setEndDateTime(
                        card.endDateTime
                          ? new Date(card.endDateTime)
                          : addWeeks(startOfWeek(today, { weekStartsOn: 1 }), 1)
                      );
                    }
                    inputRefEnd.current.focus();
                  }}
                ></Checkbox>
                <Input
                  ref={inputRefEnd}
                  type="text"
                  size="xs"
                  name="endTime"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={isSelectEndTime ? false : true}
                  value={
                    isSelectEndTime && endDateTime
                      ? isValid(endDateTime)
                        ? format(endDateTime, "dd/MM/yyyy")
                        : endDateTime
                      : "N/T/NNNN"
                  }
                  onChange={(e) => {
                    setEndDateTime(e.target.value);
                  }}
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => setCheckFocus("end")}
                />
                <Input
                  ref={inputRefEndHour}
                  type="text"
                  size="xs"
                  name="endTimeHour"
                  variant={isSelectEndTime ? "bordered" : ""}
                  readOnly={isSelectEndTime ? false : true}
                  defaultValue={
                    isSelectEndTime && endDateTime
                      ? isValid(endDateTime)
                        ? format(endDateTime, "HH:mm")
                        : "00:00"
                      : "G:pp"
                  }
                  onChange={(e) => {
                    inputRefEndHour.current.value = e.target.value;
                  }}
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => {
                    setCheckFocus("end");
                    if (inputRefEndHour.current.value === "") {
                      inputRefEndHour.current.value = "00:00";
                    }
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              color="primary"
              className="w-full mt-3"
              isDisabled={
                user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner"
              }
            >
              Lưu
            </Button>
            <Button
              onClick={() => CancelDate()}
              type="button"
              className="w-full mt-1 bg-gray-200"
              isDisabled={
                user?.role?.toLowerCase() !== "admin" &&
                user?.role?.toLowerCase() !== "owner"
              }
            >
              Gỡ bỏ
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};

let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

export default FormDate;
