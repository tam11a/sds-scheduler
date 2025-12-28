"use client";

import ListLayout from "@/components/list/ListLayout";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import CreateStaff from "./create";
import useStaffFilter from "./useStaffFilter";
import { StaffStatus } from "@/lib/generated/prisma/enums";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, setStatus } = useStaffFilter();
  return (
    <ListLayout
      secondary_action={
        <ToggleGroup
          type="single"
          value={status}
          onValueChange={setStatus}
          variant={"segmented"}
        >
          <ToggleGroupItem value={StaffStatus.ONBOARDING}>
            New Staff
          </ToggleGroupItem>
          <ToggleGroupItem value={StaffStatus.ACTIVE}>
            Active Staff
          </ToggleGroupItem>
          <ToggleGroupItem value={StaffStatus.TERMINATED}>
            Terminated
          </ToggleGroupItem>
        </ToggleGroup>
      }
      action={
        <>
          <Button variant={"outline"}>
            <Filter /> Filter
          </Button>
          <CreateStaff />
        </>
      }
    >
      {children}
    </ListLayout>
  );
}
