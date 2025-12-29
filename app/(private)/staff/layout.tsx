"use client";

import ListLayout from "@/components/list/ListLayout";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStaffFilter from "./useStaffFilter";
import { StaffStatus } from "@/lib/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useDrawer from "@/hooks/use-drawer/use-drawer";

export default function StaffClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, setStatus } = useStaffFilter();
  const { setCreateStaffOpen: onOpenChange } = useDrawer();
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
          <Button onClick={() => onOpenChange(true)}>
            <Plus /> <span className="hidden sm:inline-flex">Add Staff</span>
          </Button>
        </>
      }
    >
      {children}
    </ListLayout>
  );
}
