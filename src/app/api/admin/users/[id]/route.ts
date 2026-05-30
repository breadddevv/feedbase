import { auth } from "@/libs/auth";
import { prisma } from "@/libs/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin" && session.user.role !== "owner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await prisma.user.findUnique({
      where: { id }
    });
    return NextResponse.json({ success: true, data: data ?? null });
  } catch (err) {
    console.log("An error occured while getting suggestions", err);
    return NextResponse.json({ success: false, data: null, error: "Internal server error" });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { role, name, email, image } = body;
    const { id } = await params;

    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin" && session.user.role !== "owner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await prisma.user.update({
      where: { id },
      data: { role, name, email, image }
    });
    return NextResponse.json({ success: true, data: data ?? null });
  } catch (err) {
    console.log("An error occured while getting suggestions", err);
    return NextResponse.json({ success: false, data: null, error: "Internal server error" });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.user.role !== "admin" && session.user.role !== "owner") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.user.id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    await prisma.session.deleteMany({ where: { userId: id } });
    await prisma.account.deleteMany({ where: { userId: id } });
    await prisma.vote.deleteMany({ where: { suggestion: { authorId: id } } });
    await prisma.comment.deleteMany({ where: { parent: { authorId: id } } });
    await prisma.comment.deleteMany({ where: { authorId: id } });
    await prisma.suggestion.deleteMany({ where: { authorId: id } });

    const data = await prisma.user.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, data: data ?? null });
  } catch (err) {
    console.log("An error occured while getting suggestions", err);
    return NextResponse.json({ success: false, data: null, error: "Internal server error" });
  }
}