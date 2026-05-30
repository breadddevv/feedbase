"use client";
import { useState, useTransition } from "react";
import { ThumbsUp } from "lucide-react";
import { toggleVote } from "@/libs/suggestions";

export function SuggestionActions({
  suggestionId,
  initialVotes,
  hasVoted,
  currentUserId,
}: {
  suggestionId: string;
  initialVotes: number;
  hasVoted: boolean;
  currentUserId?: string;
}) {
  const [voted, setVoted] = useState(hasVoted);
  const [votes, setVotes] = useState(initialVotes);
  const [isPending, startTransition] = useTransition();

  function handleVote() {
    if (!currentUserId) return;
    startTransition(async () => {
      await toggleVote(suggestionId);
      setVoted((v) => !v);
      setVotes((c) => (voted ? c - 1 : c + 1));
    });
  }

  return (
    <button
      onClick={handleVote}
      disabled={!currentUserId || isPending}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all
        ${voted
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <ThumbsUp className="w-3.5 h-3.5" />
      {votes}
    </button>
  );
}