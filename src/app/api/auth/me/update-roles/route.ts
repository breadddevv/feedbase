import { auth } from "@/libs/auth";
import { prisma } from "@/libs/database";
import { resolveRole } from "@/libs/discord";
import axios from "axios";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userinfo = await prisma.user.findFirst({
    where: {
      id: session.user.id
    },
    include: {
      accounts: true
    }
  });

  if (!userinfo) return Response.json({ error: "Not Found" }, { status: 400 });

  const { accessToken } = userinfo.accounts[0];

  const { data: response } = await axios.get(
    `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
    { headers: { Authorization: `Bearer ${accessToken}` } } // todo - roles syncing, see src/app/libs/auth.ts
  );

  const role = resolveRole(response.roles ?? []);

  const data = await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      role
    }
  });

  return NextResponse.json({ success: true, data});
}