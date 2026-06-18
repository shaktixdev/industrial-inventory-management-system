import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "ok", db: "connected", time: new Date().toISOString() });
  } catch (e) {
    return NextResponse.json(
      { status: "error", db: "disconnected", message: (e as Error).message },
      { status: 503 }
    );
  }
}
