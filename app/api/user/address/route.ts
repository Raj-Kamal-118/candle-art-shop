import { NextRequest, NextResponse } from "next/server";
import { removeSavedAddress, getUserById, updateUser, setDefaultAddress } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, address } = body;

    if (!userId || !address) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingAddresses = user.savedAddresses || [];
    if (existingAddresses.length >= 8) {
      return NextResponse.json({ error: "Maximum limit of 8 addresses reached" }, { status: 400 });
    }

    const updatedAddresses = [...existingAddresses, address];

    const updatedUser = await updateUser(userId, { savedAddresses: updatedAddresses });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to add address" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, addressIndex } = body;

    if (!userId || typeof addressIndex !== "number") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const updatedUser = await removeSavedAddress(userId, addressIndex);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete address" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, addressIndex, address } = body;

    if (!userId || typeof addressIndex !== "number" || !address) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const user = await getUserById(userId);
    if (!user || !user.savedAddresses) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedAddresses = [...user.savedAddresses];
    updatedAddresses[addressIndex] = address;

    const updatedUser = await updateUser(userId, { savedAddresses: updatedAddresses });
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update address" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, addressIndex } = body;

    if (!userId || typeof addressIndex !== "number") {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const updatedUser = await setDefaultAddress(userId, addressIndex);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to set default address" }, { status: 500 });
  }
}