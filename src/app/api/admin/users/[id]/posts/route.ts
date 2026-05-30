import { auth } from "@/libs/auth";
import { prisma } from "@/libs/database";
import { discordWebhook } from "@/libs/webhook";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const suggestion = await prisma.suggestion.findMany({ where: { author: { id } } });
  if (suggestion.length == 0) return NextResponse.json({ error: "Not found" }, { status: 404 });

  for (const obj of suggestion) {
    await discordWebhook(obj.id, true);
  }

  await prisma.suggestion.deleteMany({
    where: {
      author: {
        id
      }
    }
  });
  return NextResponse.json({ success: true });
}


