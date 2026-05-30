"use client";
import { Suggestion } from "@/types/types";
import {
  ChevronUp
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function SuggestionCard({
  suggestion,
}: {
  suggestion: Suggestion;
}) {
  return (
    <Link href={`/suggestion/${suggestion.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/75 dark:bg-zinc-100/6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
      >
        <div 
          className="flex flex-col items-center justify-center gap-1 px-1 py-2 border group hover:text-primary hover:bg-primary/10 transition-colors hover:border-primary/40 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg min-w-11"
          >
          <button className="transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <ChevronUp className="w-6 h-6 group-hover:text-primary transition-colors" />
          </button> 
          <span className="text-sm font-semibold leading-none">0</span>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-sm">{suggestion.title}</h3>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {suggestion.description}
          </p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Image
              src={suggestion.author.image}
              alt={suggestion.author.name}
              width={8}
              height={8}
              className="w-4 h-4 rounded-full"
            />
            <span className="text-xs text-zinc-400">
              {suggestion.author.name}
            </span>
            {suggestion.author.role != "guest" && (
              <Image
                src={`/roles/${suggestion.author.role}.svg`}
                alt="a"
                height={16}
                width={16}
              />
            )}
            <span className="text-xs text-zinc-300 dark:text-zinc-600">·</span>
            <span className="text-xs text-zinc-400">
              {new Date(suggestion.createdAt).toLocaleDateString("en-GB")}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
