"use client";
import {
  MessageSquarePlus,
  MessageSquare,
  Plus,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/libs/auth-client";
import { signIn } from "@/libs/sign";
import { NewPostModal } from "@/components/suggestionModal";
import axios from "axios";
import { AuthSession, Provider, Suggestion } from "@/types/types";
import { SuggestionCard } from "@/components/suggestionCard";
import { resolveOAuthClient } from "@/libs/resolveOAuth";
import toast from "react-hot-toast";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isGrid, setIsGrid] = useState(false);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loadingProvider, setLoadingProvider] = useState(true);

  useEffect(() => {
    authClient.getSession().then((s) => setSession(s as AuthSession));
    resolveOAuthClient().then((p) => {
      setProvider(p);
      setLoadingProvider(false);
    });
  }, []);

  const handleSignIn = async () => {
    if (provider) {
      await signIn(provider);
    } else {
      toast.error("No OAuth provider configured");
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/feedback");
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

  const filtered = suggestions.filter(
    (s) => activeCategory === "all" || s.category === activeCategory,
  );

  async function handleNewPost(
    data: Omit<
      Suggestion,
      "id" | "votes" | "comments" | "status" | "author" | "createdAt"
    >,
  ) {
    const payload = await axios.post("/api/feedback", {
      title: data.title,
      description: data.description,
      categoryType: data.category,
    });
    setSuggestions((prev) => [
      {
        id: payload.data.data.id,
        votes: [],
        comments: [],
        status: "PENDING",
        author: {
          name: user?.name ?? "anonymous",
          image: user?.image ?? "",
          id: user?.id ?? "",
          role: user?.role ?? "guest",
        },
        createdAt: new Date().toISOString(),
        ...data,
      },
      ...prev,
    ]);
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black">
      <NewPostModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleNewPost}
      />
      <main className="flex flex-1 w-full max-w-6xl flex-col gap-6 py-24 md:py-32 px-4 md:px-16">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold m-0">Suggestions</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Share your ideas with the world!
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
                <span className="hidden sm:inline">New Post</span>
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center gap-2 bg-white/5 text-white px-3 md:px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/20 transition-all"
              >
                Login
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex flex-col gap-3 flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div
                  key={isGrid ? "grid" : "list"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={
                    isGrid
                      ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                      : "flex flex-col gap-3"
                  }
                >
                  {filtered.map((suggestion) => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      grid={isGrid}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-2"
                >
                  <MessageSquare className="w-8 h-8" />
                  <p className="text-sm">No posts in this category yet.</p>
                  {user ? (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      Make a new one!
                    </button>
                  ) : (
                    <></>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
