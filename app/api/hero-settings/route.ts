import { NextRequest, NextResponse } from "next/server";
import { getHeroSettings, updateHeroSettings } from "@/lib/data";

export async function GET() {
  try {
    const settings = await getHeroSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch hero settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await updateHeroSettings(body);
    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update hero settings" },
        { status: 500 }
      );
    }
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update hero settings" },
      { status: 500 }
    );
  }
}
