"use client";
import {
  MessageSquarePlus,
  LayoutGrid,
  LayoutList
} from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/libs/auth-client";
import { NewPostModal } from "@/components/suggestionModal";
import axios from "axios";
import { AuthSession, Suggestion } from "@/types/types";
import { SuggestionCard } from "@/components/suggestionCard";
import CategorySheet from "@/components/mobileSheet";
import { hasManagementAccess } from "../libs/permissions";
import { CreditsModal } from "@/components/credits";
import { LoginModal } from "@/components/loginModal";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isGrid, setIsGrid] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const STATUS_COLUMNS = [
    { key: "PLANNED", label: "Planned", dot: "bg-blue-500" },
    { key: "IN_PROGRESS", label: "In Progress", dot: "bg-yellow-500" },
    { key: "FINISHED", label: "Complete", dot: "bg-green-500" },
  ] as const;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/suggestion");
        setSuggestions(
          res.data.data.map((s: Suggestion) => ({
            ...s,
            votes: s.votes.length,
            comments: s.comments.length,
          })),
        );
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    authClient.getSession().then((s) => setSession(s as AuthSession));
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 640) {
        setIsGrid(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const user = session?.data?.user;
  const manageAccess = session?.data
    ? (hasManagementAccess(session) ?? false)
    : false;

  const filtered = suggestions.filter(
    (s) => activeCategory === "all" || s.category === activeCategory,
  );

  async function handleNewPost(
    data: Omit<
      Suggestion,
      "id" | "votes" | "comments" | "status" | "author" | "createdAt"
    >,
  ) {
    const payload = await axios.post("/api/suggestion", {
      title: data.title,
      description: data.description,
      categoryType: data.category,
    });
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />{" "}
      <NewPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />
      <main className="flex flex-1 w-full max-w-6xl flex-col gap-6 py-24 md:py-32 px-4 md:px-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold m-0">Roadmap</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              See what the community is stepping towards to
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => setIsGrid(false)}
                className={`p-1.5 rounded-md transition-colors ${!isGrid ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
              >
                <LayoutList className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsGrid(true)}
                className={`p-1.5 rounded-md transition-colors ${isGrid ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
            {user ? (
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 bg-primary text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </button>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 bg-white/5 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:hidden">
          <CategorySheet
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            isAdmin={manageAccess}
          />
          <p className="text-xs text-zinc-400">
            {filtered.length} {filtered.length === 1 ? "post" : "posts"}
          </p>
        </div>

        <div className="flex gap-8 justify-center items-start w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {STATUS_COLUMNS.map(({ key, label, dot }) => {
              const columnCards = filtered.filter((s) => s.status === key);
              return (
                <div
                  key={key}
                  className="flex flex-col border pb-3 border-zinc-200 dark:border-zinc-800 rounded-xl gap-4 min-h-0.4"
                >
                  <div className="flex items-center p-3 border-b border-zinc-200 justify-center border-dashed dark:border-zinc-800">
                    <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 ">
                      <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                      {label}
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 px-2">
                    {columnCards.length > 0 ? (
                      columnCards.map((s) => (
                        <SuggestionCard
                          key={s.id}
                          suggestion={s}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center flex-1 gap-2 py-10 text-center">
                        <p className="text-pretty text-zinc-400">Nothing here yet...</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
