"use client";

import { listStaff } from "@/app/api/staff/list";
import { listSchedules } from "@/app/api/schedule/list";
import { useEffect, useState } from "react";
import SchedulerComponent from "./_components/scheduler";
import { Schedule, Staff } from "@/lib/generated/prisma/client";
import useList from "@/components/list/useList";
import CreateSchedule from "./create";
import ScheduleDetails from "./details";

export default function SchedulerPage() {
  const { search } = useList();
  const [loading, setLoading] = useState(true);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchData() {
      const staffResponse = await listStaff({
        search,
      });
      const schedulesResponse = await fetch(`/api/schedule`, {});
      const schedulesData = await schedulesResponse.json();

      setStaffs(staffResponse.data);
      setSchedules(schedulesData.data);
      setLoading(false);
    }
    fetchData();
  }, [search]);

  const handleScheduleRefetch = () => {
    // Refetch schedules after creation
    listSchedules().then((response) => {
      setSchedules(response.data);
    });
  };

  return (
    <div>
      <SchedulerComponent
        staffs={staffs}
        schedules={schedules}
        loading={loading}
      />
      <CreateSchedule staffList={staffs} onSuccess={handleScheduleRefetch} />
      <ScheduleDetails onRefetch={handleScheduleRefetch} />
    </div>
  );
}
