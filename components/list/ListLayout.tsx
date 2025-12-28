import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Filter, ListTree, Plus } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-2 pb-2">
        <div>
          <Input
            placeholder="Search staff..."
            type="search"
            className="md:min-w-2xs"
          />
        </div>
        <div className="flex-1 inline-flex items-center gap-2">
          <ToggleGroup
            type="single"
            defaultValue="weekly-view"
            variant={"segmented"}
          >
            <ToggleGroupItem value="weekly-view">
              <Calendar />
            </ToggleGroupItem>
            <ToggleGroupItem value="list-view">
              <ListTree />
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
          <Button>
            <Plus /> Add Staff
          </Button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
