import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowLeft, Unlink } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-4">
      <Empty className="from-muted to-background h-full bg-linear-to-b from-30% ">
        <EmptyHeader className="pt-[10vh]">
          <EmptyMedia variant="icon" className="size-40">
            <Unlink className="size-24" />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist. Please check the URL or
            return to the homepage.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Link href={"/dashboard"}>
            <Button variant="default">
              <ArrowLeft /> Go to Dashboard
            </Button>
          </Link>
        </EmptyContent>
      </Empty>
    </main>
  );
}
