import ListSearch from "./Search";
import ViewToggle from "./ViewToggle";

export default function ListLayout({
  children,
  action,
  secondary_action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
  secondary_action?: React.ReactNode;
}) {
  return (
    <div>
      <header className="flex justify-between items-center gap-2 pb-2">
        <div>
          <ListSearch />
        </div>
        <div className="flex-1 inline-flex items-center gap-2">
          <ViewToggle />
          {secondary_action}
        </div>
        <div className="inline-flex gap-2">{action}</div>
      </header>
      <main>{children}</main>
    </div>
  );
}
