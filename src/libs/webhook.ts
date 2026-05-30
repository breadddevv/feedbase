import { prisma } from "@/libs/database";
import axios from "axios";
import { formatWebhook } from "./text";

async function delMsg(mid: string) {
  await axios.delete(`${process.env.DISCORD_WEBHOOK_URL}/messages/${mid}`);
}

export async function discordWebhook(sid: string, isDelete: boolean = false) {
  try {
    const data = await prisma.suggestion.findFirst({
      where: { id: sid },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!data) return;

    const { author, title, description, category, status, votes, messageid, id } = data;

    if (isDelete) {
      if (!messageid) return;
      await delMsg(messageid);
      return;
    }

    if (!messageid) return;

    await axios.patch(`${process.env.DISCORD_WEBHOOK_URL}/messages/${messageid}`, {
      embeds: [
        {
          title,
          description,
          color: 16730294,
          url: `${process.env.BETTER_AUTH_URL}/suggestion/${id}`,
          author: {
            name: `Posted by ${author.name}`,
            icon_url: author.image ?? null,
          },
          fields: [
            {
              name: ":bookmark_tabs: Category",
              value: formatWebhook(category),
              inline: true,
            },
            {
              name: "⬆️ Upvotes",
              value: `${votes.length}`,
              inline: true,
            },
            {
              name: ":bar_chart: Status",
              value: formatWebhook(status),
              inline: true,
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.error("[discordWebhook]", err);
  }
}