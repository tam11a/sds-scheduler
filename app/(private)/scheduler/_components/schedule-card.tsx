import { Schedule } from "@/lib/generated/prisma/browser";
import moment from "moment";
import { cn } from "@/lib/utils";
import useDrawer from "@/hooks/use-drawer/use-drawer";

interface ScheduleCardProps {
  schedule: Schedule;
  mode: "compact" | "detailed";
}

export function ScheduleCard({ schedule, mode }: ScheduleCardProps) {
  const { setScheduleDetailsId } = useDrawer();

  const handleClick = () => {
    setScheduleDetailsId(schedule.id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "bg-primary/20 text-primary rounded cursor-pointer hover:bg-primary/10 transition-colors",
        mode === "compact" ? "text-xs p-1.5 px-2" : "text-xs p-2"
      )}
    >
      {/* Time - Always visible */}
      <div className="font-medium">
        {moment(schedule.work_time_start).format("HH:mm")} -{" "}
        {moment(schedule.work_time_end).format("HH:mm")}
      </div>

      {/* Additional details - Only in detailed mode */}
      {mode === "detailed" && (
        <>
          {schedule.work_address && (
            <div className="truncate opacity-90 mt-1">
              {schedule.work_address}
            </div>
          )}
          {schedule.shift_bonus ? (
            <div className="text-[10px] opacity-80 mt-0.5">
              Bonus: ${schedule.shift_bonus}
            </div>
          ) : null}
          {schedule.instructions && (
            <div className="text-[10px] opacity-80 mt-0.5 line-clamp-2">
              {schedule.instructions}
            </div>
          )}
        </>
      )}
    </div>
  );
}
