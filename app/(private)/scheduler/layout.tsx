"use client";

import ListLayout from "@/components/list/ListLayout";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import useSchedulerFilter from "@/hooks/use-scheduler-filter/use-scheduler-filter";
import { SchedulerView } from "@/hooks/use-scheduler-filter/params";
import {
  getWeekRange,
  getMonthRange,
  navigateWeek,
  navigateMonth,
  formatDate,
} from "@/lib/scheduler-date-handler";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WeekPicker } from "@/components/scheduler/WeekPicker";
import { MonthPicker } from "@/components/scheduler/MonthPicker";
import { useState } from "react";
import useDrawer from "@/hooks/use-drawer/use-drawer";
import ScheduleDetails from "./details";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { view, setView, currentDate, setCurrentDate } = useSchedulerFilter();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const { setCreateScheduleOpen } = useDrawer();
  // Get date range based on view
  const dateRange =
    view === SchedulerView.WEEKLY
      ? getWeekRange(currentDate)
      : getMonthRange(currentDate);

  const handlePrevious = () => {
    const newDate =
      view === SchedulerView.WEEKLY
        ? navigateWeek(currentDate, "prev")
        : navigateMonth(currentDate, "prev");
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate =
      view === SchedulerView.WEEKLY
        ? navigateWeek(currentDate, "next")
        : navigateMonth(currentDate, "next");
    setCurrentDate(newDate);
  };

  return (
    <ListLayout
      primary_action={
        <div className="inline-flex space-x-1 items-center">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="ml-2">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span className="font-semibold">
                  {view === SchedulerView.WEEKLY
                    ? `${formatDate(dateRange.start, "MMM DD")} - ${formatDate(
                        dateRange.end,
                        "MMM DD, YYYY"
                      )}`
                    : formatDate(currentDate, "MMMM YYYY")}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              {view === SchedulerView.WEEKLY ? (
                <WeekPicker
                  selected={currentDate}
                  onSelect={setCurrentDate}
                  onClose={() => setDatePickerOpen(false)}
                />
              ) : (
                <MonthPicker
                  selected={currentDate}
                  onSelect={setCurrentDate}
                  onClose={() => setDatePickerOpen(false)}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      }
      action={
        <>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value as SchedulerView)}
            variant={"segmented"}
          >
            <ToggleGroupItem value={SchedulerView.WEEKLY}>
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem value={SchedulerView.MONTHLY}>
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            variant={"outline"}
            onClick={() => setCreateScheduleOpen(true)}
          >
            <Plus /> Schedule
          </Button>
        </>
      }
    >
      {children}
      <ScheduleDetails />
    </ListLayout>
  );
}
