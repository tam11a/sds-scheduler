import moment from "moment";

// Get an array of date strings between two dates (inclusive)
export function getDateRange(startDate: string, endDate: string) {
  const start = moment(startDate);
  const end = moment(endDate);
  const days = end.diff(start, "days") + 1;

  return Array.from({ length: days }, (_, i) =>
    start.clone().add(i, "day").format("YYYY-MM-DD")
  );
}

// Get the start and end dates for a given week
export function getWeekRange(date: Date | string) {
  const currentDate = moment(date);
  const startOfWeek = currentDate.clone().startOf("week"); // Sunday
  const endOfWeek = currentDate.clone().endOf("week"); // Saturday

  return {
    start: startOfWeek.format("YYYY-MM-DD"),
    end: endOfWeek.format("YYYY-MM-DD"),
    dates: getDateRange(
      startOfWeek.format("YYYY-MM-DD"),
      endOfWeek.format("YYYY-MM-DD")
    ),
  };
}

// Get the start and end dates for a given month
export function getMonthRange(date: Date | string) {
  const currentDate = moment(date);
  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");

  return {
    start: startOfMonth.format("YYYY-MM-DD"),
    end: endOfMonth.format("YYYY-MM-DD"),
    dates: getDateRange(
      startOfMonth.format("YYYY-MM-DD"),
      endOfMonth.format("YYYY-MM-DD")
    ),
  };
}

// Get calendar grid for month view (including padding days from prev/next month)
export function getMonthCalendarGrid(date: Date | string) {
  const currentDate = moment(date);
  const startOfMonth = currentDate.clone().startOf("month");
  const endOfMonth = currentDate.clone().endOf("month");

  // Get the first day of the week for the month
  const startDay = startOfMonth.clone().startOf("week");
  // Get the last day of the week for the month
  const endDay = endOfMonth.clone().endOf("week");

  const totalDays = endDay.diff(startDay, "days") + 1;
  const allDates = Array.from({ length: totalDays }, (_, i) =>
    startDay.clone().add(i, "days").format("YYYY-MM-DD")
  );

  const weeks = Array.from({ length: Math.ceil(totalDays / 7) }, (_, i) =>
    allDates.slice(i * 7, (i + 1) * 7)
  );

  return {
    weeks,
    month: currentDate.format("MMMM YYYY"),
    year: currentDate.year(),
    monthNumber: currentDate.month() + 1,
  };
}

// Navigate to next/previous week
export function navigateWeek(date: Date | string, direction: "next" | "prev") {
  const currentDate = moment(date);
  const offset = direction === "next" ? 7 : -7;
  return currentDate.add(offset, "days").toDate();
}

// Navigate to next/previous month
export function navigateMonth(date: Date | string, direction: "next" | "prev") {
  const currentDate = moment(date);
  const offset = direction === "next" ? 1 : -1;
  return currentDate.add(offset, "month").toDate();
}

// Check if a date is today
export function isToday(date: string | Date) {
  return moment(date).isSame(moment(), "day");
}

// Check if a date is in the current month
export function isCurrentMonth(
  date: string | Date,
  referenceDate: string | Date
) {
  return moment(date).isSame(moment(referenceDate), "month");
}

// Format date for display
export function formatDate(
  date: string | Date,
  format: string = "MMM DD, YYYY"
) {
  return moment(date).format(format);
}

// Get week number
export function getWeekNumber(date: string | Date) {
  return moment(date).week();
}

// Get all weeks in a month (with week numbers)
export function getWeeksInMonth(date: string | Date) {
  const monthRange = getMonthRange(date);
  const startOfMonth = moment(monthRange.start).startOf("week");
  const endOfMonth = moment(monthRange.end).endOf("week");

  const totalWeeks = endOfMonth.diff(startOfMonth, "weeks") + 1;

  return Array.from({ length: totalWeeks }, (_, i) => {
    const weekStart = startOfMonth.clone().add(i, "weeks");
    return {
      weekNumber: weekStart.week(),
      dates: getDateRange(
        weekStart.format("YYYY-MM-DD"),
        weekStart.clone().endOf("week").format("YYYY-MM-DD")
      ),
    };
  });
}
