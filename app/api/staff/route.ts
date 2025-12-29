import { NextRequest, NextResponse } from "next/server";
import { listStaff } from "./list";
import { createStaff } from "./create";
import { updateStaff } from "./update";
import { deleteStaff } from "./delete";
import { StaffStatus } from "@/lib/generated/prisma/enums";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || undefined;

  const response = await listStaff({
    search,
    status: status as StaffStatus,
  });

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await createStaff({
      ...body,
      preferred_work_starting_date: body.preferred_work_starting_date
        ? new Date(body.preferred_work_starting_date)
        : undefined,
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await updateStaff({
      ...body,
      preferred_work_starting_date: body.preferred_work_starting_date
        ? new Date(body.preferred_work_starting_date)
        : undefined,
    });
    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { success: false, error: "id is required" },
      { status: 400 }
    );
  }

  const response = await deleteStaff(parseInt(id));
  return NextResponse.json(response);
}
