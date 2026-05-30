import { betterAuth } from "better-auth";
import { dbpool } from "./database";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import axios from "axios";
import { guest, staff, owner, developer, admin as administration, contributor, perms } from "./permissions";
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
        staff,
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