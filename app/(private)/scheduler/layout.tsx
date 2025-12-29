"use client";

import ListLayout from "@/components/list/ListLayout";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import useSchedulerFilter from "@/hooks/use-scheduler-filter";
import { SchedulerView } from "@/hooks/use-scheduler-filter/params";
import {
  getWeekRange,
  getMonthRange,
  navigateWeek,
  navigateMonth,
  formatDate,
} from "@/lib/scheduler-date-handler";
import { useState } from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { view, setView, currentDate, setCurrentDate } = useSchedulerFilter();

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

  const handleToday = () => {
    setCurrentDate(new Date());
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
          <span className="font-semibold text-lg ml-2">
            {view === SchedulerView.WEEKLY
              ? `${formatDate(dateRange.start, "MMM DD")} - ${formatDate(
                  dateRange.end,
                  "MMM DD, YYYY"
                )}`
              : formatDate(currentDate, "MMMM YYYY")}
          </span>
        </div>
      }
      secondary_action={<></>}
      action={
        <>
          <ToggleGroup
            type="single"
            value={view}
            onValueChange={setView}
            variant={"segmented"}
          >
            <ToggleGroupItem value={SchedulerView.WEEKLY}>
              Weekly
            </ToggleGroupItem>
            <ToggleGroupItem value={SchedulerView.MONTHLY}>
              Monthly
            </ToggleGroupItem>
          </ToggleGroup>
          <Button variant={"outline"}>
            <Plus /> Schedule
          </Button>
        </>
      }
    >
      {children}
    </ListLayout>
  );
}
