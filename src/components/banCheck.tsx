"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/libs/auth-client";
import { AuthSession } from "@/types/types";

export function BanCheck() {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then((s) => {
      const session = s as AuthSession;
      if (session?.data?.user?.banned) {
        router.push("https://zipline.bloxhillstores.co.uk/xsNF3y.mp4");
      }
    });
  }, [router]);

  return null;
}