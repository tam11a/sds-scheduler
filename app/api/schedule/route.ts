import { NextRequest, NextResponse } from "next/server";
import { listSchedules } from "./list";
import { createSchedule } from "./create";
import { updateSchedule } from "./update";
import { deleteSchedule } from "./delete";
import { readSchedule } from "./read";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const staffIds = searchParams.get("staffIds");

  // If id is provided, return single schedule
  if (id) {
    const response = await readSchedule(parseInt(id));
    return NextResponse.json(response);
  }

  // Otherwise, return list of schedules
  if (!startDate || !endDate) {
    return NextResponse.json(
      { success: false, error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  const response = await listSchedules({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    staffIds: staffIds ? JSON.parse(staffIds) : undefined,
  });

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await createSchedule({
      ...body,
      work_time_start: new Date(body.work_time_start),
      work_time_end: new Date(body.work_time_end),
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
    const response = await updateSchedule({
      ...body,
      work_time_start: body.work_time_start
        ? new Date(body.work_time_start)
        : undefined,
      work_time_end: body.work_time_end
        ? new Date(body.work_time_end)
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

  const response = await deleteSchedule(parseInt(id));
  return NextResponse.json(response);
}
