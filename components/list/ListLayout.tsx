import { cn } from "@/lib/utils";
import ListSearch from "./Search";
import ViewToggle from "./ViewToggle";

export default function ListLayout({
  children,
  primary_action,
  secondary_action,
  secondary_centered = false,
  view_toggle = false,
  action,
}: {
  children: React.ReactNode;
  primary_action?: React.ReactNode;
  secondary_action?: React.ReactNode;
  secondary_centered?: boolean;
  view_toggle?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-2 pb-2">
        <div>{primary_action || <ListSearch />}</div>
        <div
          className={cn(
            "flex-1 inline-flex items-center gap-2",
            secondary_centered && "justify-center"
          )}
        >
          {view_toggle && <ViewToggle />}
          {secondary_action}
        </div>
        <div className="inline-flex gap-2">{action}</div>
      </header>
      <main>{children}</main>
    </div>
  );
}
