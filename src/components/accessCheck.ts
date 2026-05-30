"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/libs/auth-client";
import { AuthSession } from "@/types/types";

export function RoleCheck() {
  const router = useRouter();

  useEffect(() => {
    authClient.getSession().then((s) => {
      const session = s as AuthSession;
      if (!session) return
      if (!session.data) return

      const { user } = session?.data;

      if (!user) router.push("https://zipline.bloxhillstores.co.uk/xsNF3y.mp4");
      if (!user.role) router.push("https://zipline.bloxhillstores.co.uk/xsNF3y.mp4");

      if (user.role == "guest") {
        router.push("https://zipline.bloxhillstores.co.uk/xsNF3y.mp4");
      }
    });
  }, [router]);

  return null;
}