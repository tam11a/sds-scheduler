"use client";

import ListLayout from "@/components/list/ListLayout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
          <ToggleGroupItem value={"ALL"}>All</ToggleGroupItem>
          <ToggleGroupItem value={StaffStatus.ONBOARDING}>New</ToggleGroupItem>
          <ToggleGroupItem value={StaffStatus.ACTIVE}>Active</ToggleGroupItem>
          <ToggleGroupItem value={StaffStatus.TERMINATED}>
            Terminated
          </ToggleGroupItem>
        </ToggleGroup>
      }
      view_toggle
      action={
        <>
          <CreateStaff />
        </>
      }
    >
      {children}
    </ListLayout>
  );
}
