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
  CreateScheduleInput,
  scheduleCreateSchema,
} from "@/app/api/schedule/schema";
import { toast } from "sonner";
import { parseAsInteger, parseAsIsoDateTime, useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import * as React from "react";
import { Staff } from "@/lib/generated/prisma/browser";
import moment from "moment";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import useDrawer from "@/hooks/use-drawer/use-drawer";

interface CreateScheduleProps {
  staffList?: Staff[];
  onSuccess?: () => void;
}

export default function CreateSchedule({
  staffList = [],
  onSuccess,
}: CreateScheduleProps) {
  const { createScheduleOpen: open, setCreateScheduleOpen: onOpenChange } =
    useDrawer();

  // Pre-selected values from query params
  const [preSelectedStaffId, setPreSelectedStaffId] = useQueryState(
    "pre-staff-id",
    parseAsInteger.withOptions({ clearOnDefault: true })
  );
  const [preSelectedDate, setPreSelectedDate] = useQueryState(
    "pre-date",
    parseAsIsoDateTime.withOptions({ clearOnDefault: true })
  );

  const form = useForm<CreateScheduleInput>({
    resolver: zodResolver(scheduleCreateSchema),
    defaultValues: {
      shift_bonus: 0,
      instructions: "",
    },
  });

  // Local state for date, start time, and duration
  const [startDateTime, setStartDateTime] = React.useState<Date>();
  const [durationHours, setDurationHours] = React.useState<number>(8);

  // Calculate and update form values when start date/time and duration changes
  React.useEffect(() => {
    if (startDateTime) {
      const endDateTime = moment(startDateTime)
        .add(durationHours, "hours")
        .toISOString();

      form.setValue("work_time_start", moment(startDateTime).toISOString());
      form.setValue("work_time_end", endDateTime);
    }
  }, [startDateTime, durationHours, form]);

  // Reset form when sheet opens
  useEffect(() => {
    if (open) {
      // Use pre-selected values if available
      const staffId = preSelectedStaffId || undefined;
      const selectedDate = preSelectedDate
        ? new Date(preSelectedDate)
        : undefined;

      // Set default start time to 9 AM on the selected date
      const defaultStartTime = selectedDate
        ? moment(selectedDate).hour(9).minute(0).second(0).toDate()
        : undefined;

      form.reset({
        shift_bonus: 0,
        staff_id: staffId,
      });
      setStartDateTime(defaultStartTime);
      setDurationHours(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Clear pre-selected values after form is populated
  useEffect(() => {
    if (open && (preSelectedStaffId || preSelectedDate)) {
      // Small delay to ensure form is populated first
      const timer = setTimeout(() => {
        if (preSelectedStaffId) setPreSelectedStaffId(null);
        if (preSelectedDate) setPreSelectedDate(null);
      }, 100);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(values: CreateScheduleInput) {
    try {
      const response = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Schedule created successfully");
        onOpenChange(false);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(data.error || "Failed to create schedule");
      }
    } catch {
      toast.error("Failed to create schedule");
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <ScrollArea className="h-full">
          <SheetHeader>
            <SheetTitle>Create Schedule</SheetTitle>
            <SheetDescription>
              Fill in the details to create a new schedule for a staff member.
            </SheetDescription>
          </SheetHeader>
          <Separator className="mt-0.5 mb-4" />

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 px-4"
            >
              <div className="space-y-4">
                {/* Staff Selection */}
                <FormField
                  control={form.control}
                  name="staff_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Staff Member <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          value={field.value?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Staff Members</SelectLabel>
                              {staffList.map((staff) => (
                                <SelectItem
                                  key={staff.id}
                                  value={staff.id.toString()}
                                >
                                  {staff.full_name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>
                        Select the staff member for this schedule.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Start Date & Time */}
                <FormItem className="flex flex-col">
                  <FormLabel>
                    Start Date & Time{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <DateTimePicker
                    value={startDateTime}
                    onChange={setStartDateTime}
                    placeholder="Select start date and time"
                  />
                  <FormDescription>When does the shift start?</FormDescription>
                </FormItem>

                {/* Duration */}
                <FormItem>
                  <FormLabel>
                    Duration (hours) <span className="text-destructive">*</span>
                  </FormLabel>
                  <Input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={durationHours}
                    onChange={(e) =>
                      setDurationHours(parseFloat(e.target.value) || 0)
                    }
                  />
                  <FormDescription>
                    How many hours is this shift?
                  </FormDescription>
                </FormItem>

                {/* Work Address */}
                <FormField
                  control={form.control}
                  name="work_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Work Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123 Main St, City, State"
                          {...field}
                        />
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
                      <FormLabel>Shift Bonus ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value ? parseFloat(e.target.value) : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Optional bonus for this shift.
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
                          placeholder="Add any special instructions..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any special instructions for this shift.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Schedule Confirmation Card */}
              {startDateTime && durationHours > 0 && (
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
                  <h4 className="font-semibold mb-2">Schedule Summary</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start:</span>
                      <span className="font-medium">
                        {moment(startDateTime).format("MMM DD, YYYY • hh:mm A")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End:</span>
                      <span className="font-medium">
                        {moment(startDateTime)
                          .add(durationHours, "hours")
                          .format("MMM DD, YYYY • hh:mm A")}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{durationHours} hours</span>
                    </div>
                  </div>
                </div>
              )}

              <SheetFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting
                    ? "Creating..."
                    : "Create Schedule"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
