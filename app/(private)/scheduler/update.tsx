"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateScheduleInput,
  scheduleUpdateSchema,
} from "@/app/api/schedule/schema";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Schedule } from "@/lib/generated/prisma/browser";
import moment from "moment";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Staff } from "@/lib/generated/prisma/client";

interface UpdateScheduleProps {
  schedule: (Schedule & { staff: Staff }) | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function UpdateSchedule({
  schedule,
  open,
  onOpenChange,
  onSuccess,
}: UpdateScheduleProps) {
  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [durationHours, setDurationHours] = useState<number>(5.5);

  const form = useForm<UpdateScheduleInput>({
    resolver: zodResolver(scheduleUpdateSchema),
    defaultValues: {
      id: 0,
      work_time_start: "",
      work_time_end: "",
      work_address: "",
      shift_bonus: 0,
      instructions: "",
    },
  });

  // Load schedule data when schedule changes
  useEffect(() => {
    if (schedule) {
      const start = moment(schedule.work_time_start);
      const end = moment(schedule.work_time_end);
      const duration = moment.duration(end.diff(start));
      const hours = duration.asHours();

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartDateTime(start.toDate());
      setDurationHours(hours);

      form.reset({
        id: schedule.id,
        work_time_start: start.toISOString(),
        work_time_end: end.toISOString(),
        work_address: schedule.work_address,
        shift_bonus: schedule.shift_bonus || 0,
        instructions: schedule.instructions || "",
      });
    }
  }, [schedule, form]);

  // Auto-calculate end time when start time or duration changes
  useEffect(() => {
    if (!open) return;

    const startMoment = moment(startDateTime);
    const endMoment = startMoment.clone().add(durationHours, "hours");

    form.setValue("work_time_start", startMoment.toISOString());
    form.setValue("work_time_end", endMoment.toISOString());
  }, [startDateTime, durationHours, form, open]);

  async function onSubmit(values: UpdateScheduleInput) {
    try {
      const response = await fetch("/api/schedule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Schedule updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(data.error || "Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("An error occurred while updating the schedule");
    }
  }

  const startMoment = moment(startDateTime);
  const endMoment = startMoment.clone().add(durationHours, "hours");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <ScrollArea className="h-full pr-4">
          <SheetHeader>
            <SheetTitle>Edit Schedule</SheetTitle>
            <SheetDescription>
              Update the schedule details for {schedule?.staff?.full_name}.
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Date & Time Selection */}
              <FormField
                control={form.control}
                name="work_time_start"
                render={() => (
                  <FormItem>
                    <FormLabel>Start Date & Time *</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={startDateTime}
                        onChange={(date) => date && setStartDateTime(date)}
                      />
                    </FormControl>
                    <FormDescription>
                      When does the shift start?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Duration Input */}
              <FormItem>
                <FormLabel>Duration (hours) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="24"
                    value={durationHours}
                    onChange={(e) =>
                      setDurationHours(parseFloat(e.target.value) || 0)
                    }
                    placeholder="e.g., 5.5"
                  />
                </FormControl>
                <FormDescription>
                  How long is the shift? (in hours)
                </FormDescription>
              </FormItem>

              {/* Work Address */}
              <FormField
                control={form.control}
                name="work_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Address *</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St, City" {...field} />
                    </FormControl>
                    <FormDescription>
                      Where will the staff member work?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Shift Bonus */}
              <FormField
                control={form.control}
                name="shift_bonus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shift Bonus</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Any additional bonus for this shift? (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Instructions */}
              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any special instructions..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Special instructions or notes for this shift (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter className="pt-4">
                <div className="w-full space-y-4">
                  {/* Schedule Confirmation Card */}
                  <div className="rounded-lg bg-muted p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Start Time:</span>
                      <span className="font-medium">
                        {startMoment.format("MMM DD, YYYY hh:mm A")}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">End Time:</span>
                      <span className="font-medium">
                        {endMoment.format("MMM DD, YYYY hh:mm A")}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold">
                        {durationHours} hours
                      </span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Update Schedule
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
