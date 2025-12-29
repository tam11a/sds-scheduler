"use client";

import { Input } from "@/components/ui/input";
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
import { ScheduleCard } from "./schedule-card";
import { parseAsInteger, parseAsIsoDateTime, useQueryState } from "nuqs";
import useDrawer from "@/hooks/use-drawer/use-drawer";
import { RefreshCcwIcon, Users2 } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface SchedulerComponentProps {
  staffs: Staff[];
  schedules: Schedule[];
  loading: boolean;
}

export default function SchedulerComponent({
  staffs,
  schedules,
  loading,
}: SchedulerComponentProps) {
  const { search, setSearch } = useList();
  const { view, currentDate } = useSchedulerFilter();

  // Query states for pre-filling schedule creation form
  const [, setPreSelectedStaffId] = useQueryState(
    "pre-staff-id",
    parseAsInteger.withOptions({ clearOnDefault: true })
  );
  const [, setPreSelectedDate] = useQueryState(
    "pre-date",
    parseAsIsoDateTime.withOptions({ clearOnDefault: true })
  );
  const { setCreateScheduleOpen } = useDrawer();

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

  // Calculate total hours for a staff member in the visible date range
  const getTotalHoursForStaff = (staffId: number) => {
    const staffSchedules = schedules.filter((s) => {
      const scheduleDate = moment(s.work_time_start).format("YYYY-MM-DD");
      return s.staff_id === staffId && dateRange.dates.includes(scheduleDate);
    });

    const totalMinutes = staffSchedules.reduce((total, schedule) => {
      const start = moment(schedule.work_time_start);
      const end = moment(schedule.work_time_end);
      return total + end.diff(start, "minutes");
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (minutes === 0) {
      return `${hours} hours`;
    }
    return `${hours}h ${minutes}m`;
  };

  // Handle empty cell click to create schedule
  const handleEmptyCellClick = (staffId: number, date: string) => {
    setPreSelectedStaffId(staffId);
    // Parse date string as local date (YYYY-MM-DD)
    const [year, month, day] = date.split("-").map(Number);
    const localDate = new Date(year, month - 1, day);
    setPreSelectedDate(localDate);
    setCreateScheduleOpen(true);
  };

  // Loading State
  if (loading) {
    return (
      <Empty className="from-muted/80 to-background h-full bg-linear-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <RefreshCcwIcon className="animate-spin" />
          </EmptyMedia>
          <EmptyTitle>Loading Staff...</EmptyTitle>
          <EmptyDescription>
            Please wait while we load the staff members.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  // No Data State
  if (staffs.length === 0) {
    return (
      <Empty className="from-muted/80 to-background h-full bg-linear-to-b from-30%">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users2 />
          </EmptyMedia>
          <EmptyTitle>No Staff</EmptyTitle>
          <EmptyDescription>
            No staff members found. Try adjusting your filters or adding new
            staff.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

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
                        {getTotalHoursForStaff(staff.id)}
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
                              <ScheduleCard
                                key={schedule.id}
                                schedule={schedule}
                                mode={
                                  cellSchedules.length === 1
                                    ? "detailed"
                                    : "compact"
                                }
                              />
                            ))}
                            <div
                              className="h-full min-h-3 mt-2 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                              onClick={() =>
                                handleEmptyCellClick(staff.id, date)
                              }
                            >
                              <span className="text-xs text-muted-foreground">
                                <Plus className="inline-block w-4 h-4 animate-pulse" />
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div
                            className="h-full min-h-15 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => handleEmptyCellClick(staff.id, date)}
                          >
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
