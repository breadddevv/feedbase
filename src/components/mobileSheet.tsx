import { Bug, ChevronDown, Lightbulb, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const CATEGORIES = [
  { id: "all", label: "All Posts", icon: MessageSquare },
  { id: "SUGGESTION", label: "Suggestions", icon: Lightbulb },
  { id: "BUG", label: "Bug Reports", icon: Bug },
  { id: "FEEDBACK", label: "Feedback", icon: MessageSquare },
  { id: "FEATURE", label: "Feature Requests", icon: Star },
];

export default function CategorySheet({
  activeCategory,
  setActiveCategory,
  isAdmin = false,
}: {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = CATEGORIES.find((c) => c.id === activeCategory);
  const ActiveIcon = active?.icon ?? MessageSquare;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm font-medium"
      >
        <ActiveIcon className="w-4 h-4 text-primary" />
        {active?.label}
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-1" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-zinc-900 rounded-t-2xl border-t border-zinc-200 dark:border-zinc-800 p-4 pb-8"
            >
              <div className="w-10 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full mx-auto mb-4" />
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-1 mb-3">
                Categories
              </p>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id); setOpen(false); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left
                        ${isActive ? "bg-primary text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"}`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {cat.label}
                    </button>
                  );
                })}

                {isAdmin && (
                  <>
                    <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />
                    <Link
                      href="/manage"
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left text-primary hover:bg-primary/10"
                    >
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      Manage
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}