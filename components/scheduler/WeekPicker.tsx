"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getWeekRange, formatDate } from "@/lib/scheduler-date-handler";
import moment from "moment";
import { cn } from "@/lib/utils";

interface WeekPickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function WeekPicker({ selected, onSelect, onClose }: WeekPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(
    moment(selected).startOf("month").toDate()
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = moment(currentMonth).startOf("month");
  const monthEnd = moment(currentMonth).endOf("month");
  const calendarStart = monthStart.clone().startOf("week");
  const calendarEnd = monthEnd.clone().endOf("week");

  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  // eslint-disable-next-line prefer-const
  let day = calendarStart.clone();

  while (day.isSameOrBefore(calendarEnd)) {
    currentWeek.push(day.toDate());
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    day.add(1, "day");
  }

  const selectedWeek = getWeekRange(selected);
  const hoveredWeek = hoveredDate ? getWeekRange(hoveredDate) : null;

  const isInWeek = (date: Date, weekRange: { start: string; end: string }) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    return dateStr >= weekRange.start && dateStr <= weekRange.end;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, "month").toDate());
  };

  const handleNextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, "month").toDate());
  };

  return (
    <div className="p-3">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">
          {moment(currentMonth).format("MMMM YYYY")}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleNextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid grid-cols-7 gap-1">
            {week.map((date, dayIdx) => {
              const isSelected = isInWeek(date, selectedWeek);
              const isHovered = hoveredWeek && isInWeek(date, hoveredWeek);
              const isCurrentMonth = moment(date).isSame(currentMonth, "month");
              const isToday = moment(date).isSame(moment(), "day");

              return (
                <button
                  key={dayIdx}
                  onClick={() => {
                    onSelect(date);
                    onClose();
                  }}
                  onMouseEnter={() => setHoveredDate(date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={cn(
                    "h-9 w-9 text-sm rounded-md transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isSelected &&
                      "bg-primary/20 text-primary hover:bg-primary/40",
                    isHovered &&
                      !isSelected &&
                      "bg-accent/50 text-accent-foreground",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    isToday && !isSelected && "border border-primary"
                  )}
                >
                  {moment(date).date()}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t">
        <div className="text-xs text-muted-foreground text-center mb-2">
          {hoveredWeek
            ? `Week: ${formatDate(hoveredWeek.start, "MMM DD")} - ${formatDate(
                hoveredWeek.end,
                "MMM DD, YYYY"
              )}`
            : `Selected: ${formatDate(
                selectedWeek.start,
                "MMM DD"
              )} - ${formatDate(selectedWeek.end, "MMM DD, YYYY")}`}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onSelect(new Date());
            onClose();
          }}
        >
          This Week
        </Button>
      </div>
    </div>
  );
}
