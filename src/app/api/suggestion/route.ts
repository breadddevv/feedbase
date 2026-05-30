import { prisma } from "@/libs/database";
import { auth } from "@/libs/auth";
import { SuggestionCategory } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import axios from "axios";

const CATEGORY_MAP: Record<string, SuggestionCategory> = {
  suggestion: SuggestionCategory.SUGGESTION,
  bug: SuggestionCategory.BUG,
  feedback: SuggestionCategory.FEEDBACK,
  feature: SuggestionCategory.FEATURE,
};

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, categoryType } = body;

    if (!title || !description || !categoryType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const category = CATEGORY_MAP[categoryType.toLowerCase()];
    if (!category) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const data = await prisma.suggestion.create({
      data: {
        title,
        description,
        category,
        authorId: session.user.id
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        votes: true,
        comments: true,
      },
    });

    const discordMsg = await axios.post(`${process.env.DISCORD_WEBHOOK_URL!}?wait=true`, {
      embeds: [{
        title,
        description,
        color: 16730294,
        url: `${process.env.BETTER_AUTH_URL}/suggestion/${data.id}`,
        author: {
          name: `Posted by ${session.user.name}`,
          icon_url: session.user.image ?? null,
        },
        fields:[
          {
            name: ":bookmark_tabs: Category",
            value: categoryType,
            inline: true
          },
          {
            name: "⬆️ Upvotes",
            value: "0",
            inline: true
          },
          {
            name: ":bar_chart: Status",
            value: "Pending",
            inline: true
          },
        ]
      }]
    });

    await prisma.suggestion.update({
      where: {
        id: data.id
      },
      data: {
        messageid: discordMsg.data.id
      }
    })

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, data: null, error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  let data 
  try {
    data = await prisma.suggestion.findMany({
      include: {
        author: true,
        comments: true,
        votes: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  } catch (err) {
    console.log(`An error occured while getting suggestions`, err)
    return NextResponse.json({ success: false, data: null, error: "Internal server error" })
  }

  return NextResponse.json({ success: true, data })
}