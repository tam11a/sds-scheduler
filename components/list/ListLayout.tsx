import { Button } from "@/components/ui/button";
import { Filter, LayoutGrid, Table2 } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ListSearch from "./Search";
import CreateStaff from "@/app/(private)/staff/create";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-2 pb-2">
        <div>
          <ListSearch />
        </div>
        <div className="flex-1 inline-flex items-center gap-2">
          <ToggleGroup
            type="single"
            defaultValue="card-view"
            variant={"segmented"}
          >
            <ToggleGroupItem value="card-view">
              <LayoutGrid />
            </ToggleGroupItem>
            <ToggleGroupItem value="table-view">
              <Table2 />
            </ToggleGroupItem>
          </ToggleGroup>
          <ToggleGroup
            type="single"
            defaultValue="current-staff"
            variant={"segmented"}
          >
            <ToggleGroupItem value="current-staff">
              Current Staff
            </ToggleGroupItem>
            <ToggleGroupItem value="new-staff">New Staff</ToggleGroupItem>
            <ToggleGroupItem value="terminated-staff">
              Terminated
            </ToggleGroupItem>
            <ToggleGroupItem value="all-staff">All Staff</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="inline-flex gap-2">
          <Button variant={"outline"}>
            <Filter /> Filter
          </Button>
          <CreateStaff />
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
