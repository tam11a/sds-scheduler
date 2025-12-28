import ListLayout from "@/components/list/ListLayout";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ListLayout>{children}</ListLayout>;
}
