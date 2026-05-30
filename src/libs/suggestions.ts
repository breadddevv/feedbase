"use server";
import { prisma } from "@/libs/database";
import { auth } from "@/libs/auth";
import { headers } from "next/headers";
import { discordWebhook } from "./webhook";

export async function toggleVote(suggestionId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return
    if (!session.user) return;

    const user = session.user

    const existing = await prisma.vote.findUnique({
      where: { authorId_suggestionId: { authorId: user.id, suggestionId } },
      include: {
        suggestion: true
      }
    });

    if (existing) {
      await prisma.vote.delete({ where: { id: existing.id } });
    } else {
      await prisma.vote.create({ data: { authorId: user.id, suggestionId } });
    }

    const suggestion = await prisma.suggestion.findFirst({
      where: {
        id: suggestionId
      }
    });
    if (!suggestion) return;

    await discordWebhook(suggestionId);
    
  } catch (err) {
    console.log(err)
    return
  }
}

export async function addComment(suggestionId: string, content: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthenticated");
  return await prisma.comment.create({
    data: { content, authorId: session.user.id, suggestionId },
    include: { author: true },
  });
}

export async function addReply(suggestionId: string, content: string, parentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthenticated");
  return await prisma.comment.create({
    data: { content, authorId: session.user.id, suggestionId, parentId },
    include: { author: true },
  });
}

export async function deleteComment(commentId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthenticated");
  await prisma.comment.delete({ where: { id: commentId } });
}