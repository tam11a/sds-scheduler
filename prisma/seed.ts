import { PrismaClient } from "@/lib/generated/prisma/client";
import { Gender, StaffStatus } from "@/lib/generated/prisma/enums";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create staff members
  const staff1 = await prisma.staff.create({
    data: {
      full_name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      gender: Gender.MALE,
      status: StaffStatus.ACTIVE,
      address: "123 Main St, City",
      support_type: "PERSONAL_CARE" as any,
      preferred_weekly_working_hours: 40,
    },
  });

  const staff2 = await prisma.staff.create({
    data: {
      full_name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1234567891",
      gender: Gender.FEMALE,
      status: StaffStatus.ACTIVE,
      address: "456 Oak Ave, City",
      support_type: "NURSE" as any,
      preferred_weekly_working_hours: 35,
    },
  });

  const staff3 = await prisma.staff.create({
    data: {
      full_name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1234567892",
      gender: Gender.NONBINARY,
      status: StaffStatus.ONBOARDING,
      address: "789 Pine Rd, City",
      support_type: "ALLIED_HEALTH" as any,
      preferred_weekly_working_hours: 30,
    },
  });

  console.log("Created staff members:", { staff1, staff2, staff3 });

  // Create some sample schedules
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const schedule1 = await prisma.schedule.create({
    data: {
      staff_id: staff1.id,
      work_time_start: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
      work_time_end: new Date(today.getTime() + 17 * 60 * 60 * 1000), // 5 PM
      work_address: "Client Home - 100 First St",
      shift_bonus: 50.0,
      instructions: "Morning shift - medication assistance needed",
    },
  });

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const schedule2 = await prisma.schedule.create({
    data: {
      staff_id: staff2.id,
      work_time_start: new Date(tomorrow.getTime() + 10 * 60 * 60 * 1000), // 10 AM
      work_time_end: new Date(tomorrow.getTime() + 18 * 60 * 60 * 1000), // 6 PM
      work_address: "Client Home - 200 Second Ave",
      shift_bonus: 75.0,
      instructions: "Nursing care and vitals check",
    },
  });

  console.log("Created schedules:", { schedule1, schedule2 });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
