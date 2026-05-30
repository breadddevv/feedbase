import { auth } from "@/libs/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { reason } = await request.json() 
  const { id } = await params;
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "owner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await auth.api.banUser({
    body: {
      userId: id,
      banReason: reason
    },
    headers: hdrs,
  })

  return NextResponse.json({ success: true });
}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hdrs = await headers()
  const session = await auth.api.getSession({ headers: hdrs });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "owner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await auth.api.unbanUser({
    body: {
      userId: id
    },
    headers: hdrs,
  })

  return NextResponse.json({ success: true });
}