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
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useDrawer from "@/hooks/use-drawer/use-drawer";
import { Schedule, Staff } from "@/lib/generated/prisma/browser";
import moment from "moment";
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  User,
  Pencil,
  Trash2,
} from "lucide-react";
import NotApplicable from "@/components/ui/not-applicable";
import { toast } from "sonner";
import UpdateSchedule from "./update";

export default function ScheduleDetails({
  onRefetch,
}: {
  onRefetch?: () => void;
}) {
  const { scheduleDetailsId, setScheduleDetailsId } = useDrawer();
  const [schedule, setSchedule] = useState<
    (Schedule & { staff: Staff }) | null
  >(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOpen = scheduleDetailsId > 0;

  useEffect(() => {
    if (scheduleDetailsId <= 0) {
      setSchedule(null);
      return;
    }

    let isMounted = true;

    const fetchData = async () => {
      try {
        // Fetch schedule details with staff included
        const scheduleRes = await fetch(
          `/api/schedule?id=${scheduleDetailsId}`,
          {
            next: { tags: [`schedule-${scheduleDetailsId}`] },
          }
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

  const refetchScheduleDetails = async () => {
    if (scheduleDetailsId <= 0) return;

    try {
      const scheduleRes = await fetch(`/api/schedule?id=${scheduleDetailsId}`, {
        cache: "no-store",
      });
      const scheduleData = await scheduleRes.json();

      if (scheduleData.success && scheduleData.data) {
        setSchedule(scheduleData.data);
      }
    } catch (error) {
      console.error("Failed to refetch schedule details:", error);
    }
  };

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

  const handleDelete = async () => {
    if (!schedule) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/schedule?id=${schedule.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Schedule deleted", {
          description: "The schedule has been successfully deleted.",
        });
        setShowDeleteDialog(false);
        onRefetch?.();
        handleClose();
      } else {
        toast.error("Error", {
          description: data.error || "Failed to delete schedule",
        });
      }
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      toast.error("Error", {
        description: "Failed to delete schedule",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleEditSuccess = () => {
    // Refetch both the details and trigger parent list refresh
    refetchScheduleDetails();
    onRefetch?.();
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

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 pb-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleEdit}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Schedule
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Schedule
                </Button>
              </div>

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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule for{" "}
              {schedule?.staff.full_name} on{" "}
              {schedule &&
                moment(schedule.work_time_start).format("MMM DD, YYYY")}
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <UpdateSchedule
        schedule={schedule}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onSuccess={handleEditSuccess}
      />
    </Sheet>
  );
}
