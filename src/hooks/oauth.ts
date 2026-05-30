import axios from "axios";
import { useEffect, useState } from "react";

export const OAuthOptions = () => {
    const [oauthAvailable, setOAuthAvailable] = useState(false);
    const [oauthProviders, setOAuthProviders] = useState<string[]>([]);

    useEffect(() => {
        axios.get("/api/auth/providers")
            .then((response) => {
                setOAuthAvailable(true);
                setOAuthProviders(response.data.providers);
            })
            .catch((error) => {
                console.error("Error fetching OAuth providers:", error);
                setOAuthAvailable(false);
            });
    }, []);

    return { oauthAvailable, oauthProviders };
};