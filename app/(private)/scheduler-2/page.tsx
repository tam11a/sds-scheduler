"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScheduleDialog } from "@/components/scheduler/ScheduleDialog";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { listStaff } from "@/app/api/staff/list";
import { listSchedules } from "@/app/api/schedule/list";
import { Schedule, Staff } from "@/lib/generated/prisma/client";

export default function SchedulerPage2() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [selectedStaffId, setSelectedStaffId] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  // Get week dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const weekStart = weekDates[0];
  const weekEnd = new Date(weekDates[6]);
  weekEnd.setHours(23, 59, 59, 999);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch staff
      const staffData = await listStaff();
      setStaffList((staffData.data as Staff[]) || []);

      // Fetch schedules
      const scheduleData = await listSchedules({
        startDate: weekStart,
        endDate: weekEnd,
      });
      if (scheduleData.success) {
        setSchedules(
          scheduleData.data?.map((s: Schedule) => ({
            ...s,
            work_time_start: new Date(s.work_time_start),
            work_time_end: new Date(s.work_time_end),
          })) || []
        );
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleCellClick = (staffId: number, date: Date) => {
    const schedule = schedules.find(
      (s) =>
        s.staff_id === staffId &&
        s.work_time_start.toDateString() === date.toDateString()
    );

    if (schedule) {
      setSelectedSchedule(schedule);
      setSelectedStaffId(undefined);
      setSelectedDate(undefined);
    } else {
      setSelectedSchedule(null);
      setSelectedStaffId(staffId);
      setSelectedDate(date);
    }
    setDialogOpen(true);
  };

  const handleSave = async (schedule: Schedule) => {
    try {
      if (schedule.id) {
        // Update
        const response = await fetch("/api/schedule", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        });
        if (response.ok) {
          fetchData();
        }
      } else {
        // Create
        const response = await fetch("/api/schedule", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(schedule),
        });
        console.log("Create response:", response);
        if (response.ok) {
          fetchData();
        }
      }
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/schedule?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error);
    }
  };

  const getSchedulesForCell = (staffId: number, date: Date) => {
    return schedules.filter(
      (s) =>
        s.staff_id === staffId &&
        s.work_time_start.toDateString() === date.toDateString()
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  console.log("Staff List:", staffList);
  console.log("Schedules:", schedules);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Weekly Schedule</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-50 text-center">
            {weekDates[0].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {weekDates[6].toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-200">
          {/* Header */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="p-2 font-semibold bg-muted rounded">Staff</div>
            {weekDates.map((date, i) => (
              <div
                key={i}
                className="p-2 text-center font-semibold bg-muted rounded"
              >
                <div className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div>{date.getDate()}</div>
              </div>
            ))}
          </div>

          {/* Staff Rows */}
          {staffList.map((staff) => (
            <div key={staff.id} className="grid grid-cols-8 gap-1 mb-1">
              {/* Staff Name Cell */}
              <Card className="p-2 flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={staff.avatar || ""} alt={staff.full_name} />
                  <AvatarFallback>
                    {staff.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate">
                  {staff.full_name}
                </span>
              </Card>

              {/* Date Cells */}
              {weekDates.map((date, i) => {
                const cellSchedules = getSchedulesForCell(staff.id, date);
                return (
                  <Card
                    key={i}
                    className="p-1 min-h-20 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleCellClick(staff.id, date)}
                  >
                    {cellSchedules.length > 0 ? (
                      <div className="space-y-1">
                        {cellSchedules.map((schedule) => (
                          <div
                            key={schedule.id}
                            className="bg-primary text-primary-foreground text-xs p-1 rounded"
                          >
                            <div className="font-medium">
                              {formatTime(schedule.work_time_start)} -{" "}
                              {formatTime(schedule.work_time_end)}
                            </div>
                            <div className="truncate">
                              {schedule.work_address}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <ScheduleDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        schedule={selectedSchedule}
        staffId={selectedStaffId}
        defaultDate={selectedDate}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
