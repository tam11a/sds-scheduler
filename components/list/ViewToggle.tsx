"use client";

import useList from "./useList";
import { LayoutGrid, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export default function ViewToggle() {
  const { view, setView } = useList();

  return (
    <ToggleGroup
      type="single"
      value={view}
      onValueChange={setView}
      variant={"segmented"}
    >
      <ToggleGroupItem value="card-view">
        <LayoutGrid />
      </ToggleGroupItem>
      <ToggleGroupItem value="table-view">
        <Table2 />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
