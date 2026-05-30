import { authClient } from "@/libs/auth-client"

export const signIn = async () => {
    await authClient.signIn.social({
        provider: "discord"
    })
}