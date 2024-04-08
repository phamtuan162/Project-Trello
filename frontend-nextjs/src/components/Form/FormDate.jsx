"use client";
import { useSelector, useDispatch } from "react-redux";

import { Menu, Transition } from "@headlessui/react";
import { DotsVerticalIcon } from "@heroicons/react/outline";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isWithinInterval,
  isSameMonth,
  isToday,
  parse,
  parseISO,
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
const { updateCard } = cardSlice.actions;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const FormDate = ({ children }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const card = useSelector((state) => state.card.card);
  let today = startOfToday();

  let [selectedDay, setSelectedDay] = useState(
    card.startDateTime || card.endDateTime || today
  );
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
    DateCardApi(card.id, {
      startDateTime: startDate && parse(startDate, "dd/MM/yyyy", new Date()),
      endDateTime: endDate && parse(endDate, "dd/MM/yyyy", new Date()),
      status: "pending",
    }).then((data) => {
      if (data.status === 200) {
        const cardUpdate = {
          ...card,
          startDateTime: data.data.startDateTime,
          endDateTime: data.data.endDateTime,
          status: "pending",
        };
        dispatch(updateCard(cardUpdate));
        setIsOpen(false);
      } else {
        const error = data.error;
        toast.error(error);
      }
    });
  };
  return (
    <Popover
      placement="right"
      isOpen={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className=" p-2 px-3 w-[300px] ">
        <div className=" max-h-[500px] overflow-x-auto w-full">
          <div className="flex justify-between items-center relative w-full">
            <h1 className="grow text-center ">Ngày</h1>
            <Button
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto"
              onClick={() => setIsOpen(false)}
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

                  <div className="grid grid-cols-7 mt-2 text-sm gap-1">
                    {days.map((day, dayIdx) => (
                      <div
                        key={day.toString()}
                        className={classNames(
                          dayIdx === 0 && colStartClasses[getDay(day)],
                          "py-1.5"
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
                            isEqual(day, startDateTime) &&
                              "font-semibold bg-blue-100 text-indigo-400",
                            isEqual(day, endDateTime) &&
                              "font-semibold bg-blue-100 text-indigo-400",
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
                      ? format(startDateTime, "dd/MM/yyyy")
                      : "N/T/NNNN"
                  }
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => setCheckFocus("start")}
                />
              </div>
            </div>
            <div className="w-full mt-3">
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
                      ? format(endDateTime, "dd/MM/yyyy")
                      : "N/T/NNNN"
                  }
                  className={`w-[120px] focus-visible:outline-0  p-1 rounded-md`}
                  onFocus={() => setCheckFocus("end")}
                />
              </div>
            </div>

            <Button type="submit" color="primary" className="w-full mt-3">
              Lưu
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
