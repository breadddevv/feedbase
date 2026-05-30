import { betterAuth } from "better-auth";
import { dbpool } from "./database";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import axios from "axios";
import { guest, teamboostify, owner, developer, admin as administration, contributor, perms } from "./permissions";
import { resolveRole } from "./discord";
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
  database: dbpool,
  socialProviders: {
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      enabled: true,
      prompt: "consent",
      scope: ["guilds.members.read"],
      async getUserInfo(token) {
        const [userRes, memberRes] = await Promise.allSettled([
          axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${token.accessToken}` },
          }),
          axios.get(
            `https://discord.com/api/users/@me/guilds/${process.env.DISCORD_GUILD_ID}/member`,
            {
              headers: { Authorization: `Bearer ${token.accessToken}` },
            }
          ),
        ]);

        const user = userRes.status === "fulfilled" ? userRes.value.data : null;

        if (!user?.id) return null;

        let member = null;

        if (memberRes.status === "fulfilled") {
          member = memberRes.value.data;
        }

        const role = member?.roles?.length
          ? resolveRole(member.roles)
          : "guest";

        return {
          user: {
            id: user.id,
            name: user.global_name ?? user.username,
            email: user.email,
            emailVerified: user.verified ?? false,
            image: user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
              : undefined,
            role,
          },
          data: user,
        };
      }
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/error") {
        if (ctx.query && "error" in ctx.query && ctx.query.error === "banned") {
          throw ctx.redirect(`https://zipline.bloxhillstores.co.uk/xsNF3y.mp4`);
        }
      }
    })
  },
  plugins: [
    nextCookies(),
    admin({
      perms,
      defaultRole: "guest",
      roles: {
        guest,
        admin: administration,
        owner,
        staff: teamboostify,
        developer,
        contributor
      },
      adminRoles: ["owner", "admin"],
    }),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "guest",
      },
    }
  }
});