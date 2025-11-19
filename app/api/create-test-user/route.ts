import { NextResponse } from "next/server";
import { createTestUser } from "@/lib/populateDummyData";

export async function POST() {
  try {
    console.log("Creating test user account...");

    const result = await createTestUser(
      "user@test.com",
      "user123",
      "Test User"
    );

    return NextResponse.json({
      success: true,
      message: "Test user created successfully!",
      user: result,
    });
  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create test user",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
