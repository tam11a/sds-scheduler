"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import useDrawer from "@/hooks/use-drawer/use-drawer";
import { Schedule, Staff } from "@/lib/generated/prisma/browser";
import moment from "moment";
import { Calendar, MapPin, DollarSign, FileText, User } from "lucide-react";
import NotApplicable from "@/components/ui/not-applicable";

export default function ScheduleDetails() {
  const { scheduleDetailsId, setScheduleDetailsId } = useDrawer();
  const [schedule, setSchedule] = useState<
    (Schedule & { staff: Staff }) | null
  >(null);

  const isOpen = scheduleDetailsId > 0;

  useEffect(() => {
    if (scheduleDetailsId <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSchedule(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch schedule details with staff included
        const scheduleRes = await fetch(
          `/api/schedule?id=${scheduleDetailsId}`
        );
        const scheduleData = await scheduleRes.json();

        if (!isMounted) return;

        if (scheduleData.success && scheduleData.data) {
          setSchedule(scheduleData.data);
        }
      } catch (error) {
        console.error("Failed to fetch schedule details:", error);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [scheduleDetailsId]);

  const handleClose = () => {
    setScheduleDetailsId(0);
  };

  const calculateDuration = () => {
    if (!schedule) return "0 hours";
    const start = moment(schedule.work_time_start);
    const end = moment(schedule.work_time_end);
    const duration = moment.duration(end.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();

    if (minutes === 0) {
      return `${hours} hours`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <SheetContent>
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Schedule Details</SheetTitle>
            <SheetDescription>
              View detailed information about this schedule.
            </SheetDescription>
          </SheetHeader>
          <Separator className="mb-4 mt-0.5" />

          {!schedule ? (
            <div className="text-center py-12 text-muted-foreground">
              Loading...
            </div>
          ) : (
            <div className="space-y-2 px-4">
              {/* Staff Information */}
              <div className="rounded-lg border  p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Staff Member</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{schedule.staff.full_name}</p>
                  <p className="text-muted-foreground">
                    {schedule.staff.email}
                  </p>
                  {schedule.staff.phone && (
                    <p className="text-muted-foreground">
                      {schedule.staff.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Time & Date Information */}
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Time & Location</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium">
                      {moment(schedule.work_time_start).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Time</span>
                    <span className="font-medium">
                      {moment(schedule.work_time_start).format("hh:mm A")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Time</span>
                    <span className="font-medium">
                      {moment(schedule.work_time_end).format("hh:mm A")}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{calculateDuration()}</span>
                  </div>
                </div>
              </div>

              {/* Work Address */}
              <div className="rounded-lg border  p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Work Address</h3>
                </div>
                <p className="text-sm">
                  {schedule.work_address || <NotApplicable />}
                </p>
              </div>

              {/* Shift Bonus */}
              <div className="flex justify-between items-center rounded-lg border  p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Shift Bonus</h3>
                </div>
                <p className="text-sm font-medium">
                  ${schedule.shift_bonus?.toFixed(2) || <NotApplicable />}
                </p>
              </div>

              {/* Instructions */}
              {schedule.instructions && (
                <div className="rounded-lg border  p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Instructions</h3>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {schedule.instructions}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-3 px-1">
                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Created</span>
                    <span>
                      {moment(schedule.createdAt).format(
                        "MMM DD, YYYY hh:mm A"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated</span>
                    <span>
                      {moment(schedule.updatedAt).format(
                        "MMM DD, YYYY hh:mm A"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
