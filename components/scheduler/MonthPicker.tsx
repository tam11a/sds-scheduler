"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";

interface MonthPickerProps {
  selected: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function MonthPicker({ selected, onSelect, onClose }: MonthPickerProps) {
  const [currentYear, setCurrentYear] = useState(moment(selected).year());

  const months = moment.months();
  const selectedMonth = moment(selected).month();
  const selectedYear = moment(selected).year();
  const currentMonth = moment().month();
  const currentMonthYear = moment().year();

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = moment(selected)
      .year(currentYear)
      .month(monthIndex)
      .toDate();
    onSelect(newDate);
    onClose();
  };

  return (
    <div className="p-3 w-70">
      {/* Year Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handlePreviousYear}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{currentYear}</div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={handleNextYear}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Month Grid */}
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => {
          const isSelected =
            index === selectedMonth && currentYear === selectedYear;
          const isCurrent =
            index === currentMonth && currentYear === currentMonthYear;

          return (
            <button
              key={month}
              onClick={() => handleMonthClick(index)}
              className={cn(
                "py-2 px-3 text-sm rounded-md transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                isCurrent && !isSelected && "border border-primary"
              )}
            >
              {month.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            onSelect(new Date());
            onClose();
          }}
        >
          This Month
        </Button>
      </div>
    </div>
  );
}
