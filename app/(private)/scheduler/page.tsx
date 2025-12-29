"use client";

import { listStaff } from "@/app/api/staff/list";
import { listSchedules } from "@/app/api/schedule/list";
import { useEffect, useState } from "react";
import SchedulerComponent from "./_components/scheduler";
import { Schedule, Staff } from "@/lib/generated/prisma/client";
import useList from "@/components/list/useList";

export default function SchedulerPage() {
  const { search } = useList();

  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    async function fetchData() {
      const staffResponse = await listStaff({
        search,
      });
      const schedulesResponse = await listSchedules();
      setStaffs(staffResponse.data);
      setSchedules(schedulesResponse.data);
    }
    fetchData();
  }, [search]);

  return (
    <div>
      <SchedulerComponent staffs={staffs} schedules={schedules} />
    </div>
  );
}
