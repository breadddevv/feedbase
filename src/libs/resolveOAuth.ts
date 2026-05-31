import { Provider } from "@/types/types";
import toast from "react-hot-toast";

export function resolveOAuth(): Provider {
  const providers = {
    discord: process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET,
    google: process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
    roblox: process.env.ROBLOX_CLIENT_ID && process.env.ROBLOX_CLIENT_SECRET,
    github: process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
  };

  const configured = Object.entries(providers).filter(([, enabled]) => enabled);

  if (configured.length === 0) {
    toast.error("No OAuth providers configured. Please contact the administrator.");
    throw new Error("No OAuth providers configured");
  }

  if (configured.length > 1) {
    toast.error("Multiple OAuth providers configured. Please configure only one.");
    throw new Error(
      `Only one OAuth provider is supported, but found: ${configured.map(([name]) => name).join(", ")}`
    );
  }

  return configured[0][0] as Provider;
}