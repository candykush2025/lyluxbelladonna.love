import { NextResponse } from "next/server";
import { populateDummyData } from "@/lib/populateDummyData";

export async function POST() {
  try {
    console.log("Starting dummy data population via API...");

    await populateDummyData();

    return NextResponse.json({
      success: true,
      message: "Dummy data populated successfully!",
    });
  } catch (error) {
    console.error("Error populating dummy data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to populate dummy data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
