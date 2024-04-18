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
  setHours,
  setMinutes,
  addDays,
  compareAsc,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Checkbox,
  Input,
  CheckboxGroup,
  CircularProgress,
} from "@nextui-org/react";
import { CloseIcon } from "@/components/Icon/CloseIcon";
import { cardSlice } from "@/stores/slices/cardSlice";
import { toast } from "react-toastify";
import { Message } from "@/components/Message/Message";
import { updateMissionApi } from "@/services/workspaceApi";
const { updateCard } = cardSlice.actions;
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
let colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
function truncateTimeFromDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
const validateHourMinute = (hour, minute) => {
  return (
    parseInt(hour) >= 0 &&
    parseInt(hour) <= 23 &&
    parseInt(minute) >= 0 &&
    parseInt(minute) <= 59
  );
};
const SetDate = ({ children, mission }) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const card = useSelector((state) => state.card.card);
  const user = useSelector((state) => state.user.user);
  let today = startOfToday();

  let [selectedDay, setSelectedDay] = useState(
    mission.endDateTime || addDays(today, 1)
  );
  const [checkFocus, setCheckFocus] = useState("");
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [endDateTime, setEndDateTime] = useState(
    mission.endDateTime ? new Date(mission.endDateTime) : addDays(today, 1)
  );
  const [isSelectEndTime, setIsSelectEndTime] = useState(true);
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
    if (checkFocus === "end") {
      if (compareAsc(selectedDay, today) === -1) {
        setEndDateTime(addDays(today, 1));
      }
      {
        setEndDateTime(selectedDay);
      }
    }
  }, [selectedDay]);

  const UpdateDate = async (formData) => {
    setIsLoading(true);
    const endDate = formData.get("endTime");
    const endDateHour = formData.get("endTimeHour");

    // Kiểm tra ngày/tháng/năm không hợp lệ

    let endDateTimeUpdate = endDateTime
      ? parse(endDate, "dd/MM/yyyy", new Date())
      : endDateTime;
    if (endDateTimeUpdate && !isValid(endDateTimeUpdate)) {
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
    if (endDateTimeUpdate && compareAsc(endDateTimeUpdate, new Date()) === -1) {
      setMessage("Ngày hết hạn phải lớn hơn thời gian hiện tại!");
      return;
    }
    const updatedWorks = card.works.map((work) => {
      if (+work.id === +mission.work_id) {
        const updatedMissions = work.missions.map((item) => {
          if (+item.id === +mission.id) {
            return {
              ...mission,
              endDateTime: endDateTimeUpdate.getTime(),
            };
          }
          return mission;
        });
        return { ...work, missions: updatedMissions };
      }
      return work;
    });
    const updatedCard = { ...card, works: updatedWorks };
    try {
      const data = await updateMissionApi(mission.id, {
        endDateTime: endDateTimeUpdate,
      });

      const { status, error, data: updatedData } = data;
      if (status === 200) {
        dispatch(updateCard(updatedCard));
        setIsLoading(false);

        setIsOpen(false);
        setMessage("");
      } else {
        toast.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("An error occurred while updating the date.");
    }
  };

  const CancelDate = async () => {
    try {
      setIsLoading(true);

      const updatedWorks = card.works.map((work) => {
        if (+work.id === +mission.work_id) {
          const updatedMissions = work.missions.map((item) => {
            if (+item.id === +mission.id) {
              return {
                ...mission,
                endDateTime: null,
              };
            }
            return mission;
          });
          return { ...work, missions: updatedMissions };
        }
        return work;
      });
      const updatedCard = { ...card, works: updatedWorks };
      const data = await updateMissionApi(mission.id, {
        endDateTime: null,
      });

      const { status, error, data: updatedData } = data;
      if (status === 200) {
        dispatch(updateCard(updatedCard));
        setIsLoading(false);

        setIsOpen(false);
      } else {
        toast.error(error);
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("An error occurred while updating the date.");
    }
  };

  const HandleReset = async () => {
    setIsOpen(false);
    setCheckFocus("");
    setMessage("");
    setSelectedDay(mission.endDateTime || addDays(today, 1));
    setEndDateTime(
      mission.endDateTime ? new Date(mission.endDateTime) : addDays(today, 1)
    );
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
              className="min-w-3 rounded-lg border-0 hover:bg-default-300  p-1 absolute right-0 h-auto "
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
                            if (checkFocus === "end") {
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
                      setEndDateTime(null);
                    } else {
                      setEndDateTime(
                        mission.endDateTime
                          ? new Date(mission.endDateTime)
                          : addDays(today, 1)
                      );
                    }
                    inputRefEnd.current.focus();
                  }}
                />

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
                  className={`w-[80px] focus-visible:outline-0  p-1 rounded-md`}
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
              isDisabled={isLoading}
              type="submit"
              color="primary"
              className="w-full mt-3 font-medium"
            >
              {isLoading ? <CircularProgress /> : "Lưu"}
            </Button>
            <Button
              isDisabled={isLoading}
              onClick={CancelDate}
              type="button"
              className="w-full mt-1 bg-gray-200  font-medium"
            >
              {isLoading ? <CircularProgress /> : "Gỡ bỏ"}
            </Button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
};
export default SetDate;
