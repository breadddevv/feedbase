import { prisma } from "@/libs/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await prisma.user.findMany({ include: {
      _count: true,
      accounts: true,
      suggestions: true,
      comments: true,
      votes: true,
    }});
    return NextResponse.json({ success: true, data})
  } catch (err) {
    console.log(`An error occured while getting suggestions`, err)
    return NextResponse.json({ success: false, data: null, error: "Internal server error" })
  }
}