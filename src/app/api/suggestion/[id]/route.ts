import { discordWebhook } from "@/libs/webhook";
import { auth } from "@/libs/auth";
import { prisma } from "@/libs/database";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ALLOWED_ROLES } from "@/libs/permissions";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await prisma.suggestion.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          where: { parentId: null },
          include: {
            author: true,
            parent: true,
            replies: {
              include: { author: true },
            },
            suggestion: true,
          },
        },
        votes: true,
      },
    });
    return NextResponse.json({ success: true, data: data ?? null });
  } catch (err) {
    console.log("An error occured while getting suggestions", err);
    return NextResponse.json({ success: false, data: null, error: "Internal server error" });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const suggestion = await prisma.suggestion.findUnique({ where: { id } });
  if (!suggestion) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ((suggestion.authorId !== session.user.id) && !ALLOWED_ROLES[session.user.role]) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, description, category, status } = await request.json();
  const updated = await prisma.suggestion.update({
    where: { id },
    data: { title, description, category, status },
    include: {
      author: { select: { id: true, name: true, image: true } },
      votes: true,
      comments: true,
    },
  });

  await discordWebhook(suggestion.id);
  return NextResponse.json({ data: updated });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const suggestion = await prisma.suggestion.findUnique({ where: { id } });
  if (!suggestion) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if ((suggestion.authorId !== session.user.id) && !ALLOWED_ROLES[session.user.role]) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  
  await discordWebhook(suggestion.id, true);

  await prisma.suggestion.delete({ where: { id } });
  return NextResponse.json({ success: true });
}