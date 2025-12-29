"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Schedule } from "@/lib/generated/prisma/client";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: Schedule | null;
  staffId?: number;
  defaultDate?: Date;
  onSave: (schedule: Schedule) => void;
  onDelete?: (id: number) => void;
}

export function ScheduleDialog({
  open,
  onOpenChange,
  schedule,
  staffId,
  defaultDate,
  onSave,
  onDelete,
}: ScheduleDialogProps) {
  const [formData, setFormData] = useState<Schedule>(() => {
    if (schedule) return schedule as Schedule;

    const startDate = defaultDate || new Date();
    startDate.setHours(9, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(17, 0, 0, 0);

    return {
      staff_id: staffId || 0,
      work_time_start: startDate,
      work_time_end: endDate,
      work_address: "",
      shift_bonus: 0,
      instructions: "",
    } as Schedule;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (schedule?.id && onDelete) {
      onDelete(schedule.id);
      onOpenChange(false);
    }
  };

  const formatDateTimeLocal = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {schedule ? "Edit Schedule" : "Create Schedule"}
          </DialogTitle>
          <DialogDescription>
            {schedule
              ? "Update the schedule details below"
              : "Add a new schedule for the staff member"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="work_time_start">Start Time</Label>
              <Input
                id="work_time_start"
                type="datetime-local"
                value={formatDateTimeLocal(formData.work_time_start)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    work_time_start: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="work_time_end">End Time</Label>
              <Input
                id="work_time_end"
                type="datetime-local"
                value={formatDateTimeLocal(formData.work_time_end)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    work_time_end: new Date(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="work_address">Work Address</Label>
              <Input
                id="work_address"
                value={formData.work_address}
                onChange={(e) =>
                  setFormData({ ...formData, work_address: e.target.value })
                }
                placeholder="Enter work address"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shift_bonus">Shift Bonus ($)</Label>
              <Input
                id="shift_bonus"
                type="number"
                step="0.01"
                value={formData.shift_bonus || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shift_bonus: parseFloat(e.target.value),
                  })
                }
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                value={formData.instructions || ""}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                placeholder="Add any special instructions..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between">
            {schedule && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
