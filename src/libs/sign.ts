import { authClient } from "@/libs/auth-client";
import { Provider } from "@/types/types";

export const signIn = async (type: Provider) => {
  switch (type) {
    case "github":
    case "google":
    case "roblox":
    case "discord":
      await authClient.signIn.social({
        provider: type,
      });
  }
};
