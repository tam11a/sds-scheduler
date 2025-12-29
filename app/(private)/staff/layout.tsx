"use client";

import ListLayout from "@/components/list/ListLayout";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter } from "lucide-react";
import CreateStaff from "./create";
import useStaffFilter from "./useStaffFilter";
import { StaffStatus } from "@/lib/generated/prisma/enums";

export default function StaffClientLayout({
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
          onValueChange={(value) => value && setStatus(value as StaffStatus)}
          variant={"segmented"}
        >
          <ToggleGroupItem value={"ALL"}>All Staff</ToggleGroupItem>
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
      view_toggle
      action={
        <>
          <Button variant={"outline"} disabled>
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
