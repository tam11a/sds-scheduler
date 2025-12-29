"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Schedule, Staff } from "@/lib/generated/prisma/browser";
import useList from "@/components/list/useList";
import useSchedulerFilter from "@/hooks/use-scheduler-filter/use-scheduler-filter";
import { SchedulerView } from "@/hooks/use-scheduler-filter/params";
import {
  getWeekRange,
  getMonthRange,
  formatDate,
  isToday,
} from "@/lib/scheduler-date-handler";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface SchedulerComponentProps {
  staffs: Staff[];
  schedules: Schedule[];
}

export default function SchedulerComponent({
  staffs,
  schedules,
}: SchedulerComponentProps) {
  console.log("Staffs in SchedulerComponent:", staffs);
  console.log("Schedules in SchedulerComponent:", schedules);

  const { search, setSearch } = useList();
  const { view, currentDate } = useSchedulerFilter();

  // Get date range based on view
  const dateRange =
    view === SchedulerView.WEEKLY
      ? getWeekRange(currentDate)
      : getMonthRange(currentDate);

  const getSchedulesForCell = (staffId: number, date: string) => {
    return schedules.filter(
      (s) =>
        s.staff_id === staffId &&
        moment(s.work_time_start).format("YYYY-MM-DD") === date
    );
  };

  return (
    <section className="space-y-4">
      {/* Schedule Table */}
      <div className="border rounded-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-background border-r min-w-50">
                  <Input
                    type="search"
                    placeholder="Search Staff..."
                    className="min-w-48 w-full border-0! shadow-none! ring-0!"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </TableHead>
                {/* Date Columns */}
                {dateRange.dates.map((date) => (
                  <TableHead
                    key={date}
                    className={`text-center min-w-30 border-x py-2 space-y-1.5 ${
                      isToday(date) ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-xs text-muted-foreground">
                      {formatDate(date, "ddd")}
                    </div>
                    <div className={cn("font-semibold text-lg")}>
                      <span
                        className={
                          isToday(date)
                            ? "bg-primary rounded-full text-primary-foreground p-1 px-1.5"
                            : ""
                        }
                      >
                        {formatDate(date, "DD")}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(date, "MMM")}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs?.map((staff) => (
                <TableRow key={staff.id}>
                  <TableCell className="font-medium sticky left-0 z-10 bg-background border-r">
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {staff.email}
                      </span>
                    </div>
                  </TableCell>
                  {/* Schedule Cells */}
                  {dateRange.dates.map((date) => {
                    const cellSchedules = getSchedulesForCell(staff.id, date);
                    return (
                      <TableCell
                        key={date}
                        className={`p-2 align-top border-x ${
                          isToday(date) ? "bg-primary/5" : ""
                        }`}
                      >
                        {cellSchedules.length > 0 ? (
                          <div className="space-y-1">
                            {cellSchedules.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="bg-primary text-primary-foreground text-xs p-2 rounded cursor-pointer hover:bg-primary/90 transition-colors"
                              >
                                <div className="font-medium">
                                  {moment(schedule.work_time_start).format(
                                    "HH:mm"
                                  )}{" "}
                                  -{" "}
                                  {moment(schedule.work_time_end).format(
                                    "HH:mm"
                                  )}
                                </div>
                                {schedule.work_address && (
                                  <div className="truncate opacity-90">
                                    {schedule.work_address}
                                  </div>
                                )}
                                {schedule.shift_bonus && (
                                  <div className="text-[10px] opacity-80">
                                    Bonus: ${schedule.shift_bonus}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-15 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs text-muted-foreground">
                              <Plus className="inline-block w-4 h-4 animate-pulse" />
                            </span>
                          </div>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Empty State */}
      {staffs?.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No staff members found. Add staff members to start scheduling.
        </div>
      )}
    </section>
  );
}
