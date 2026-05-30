import { Suggestion } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bug,
  Check,
  ChevronDown,
  Lightbulb,
  MessageSquare,
  Plus,
  Send,
  Star,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { MarkdownEditor } from "./markdownEditor";
import leoProfanity from "leo-profanity";
leoProfanity.loadDictionary("en");

const CATEGORY_OPTIONS = [
  { id: "SUGGESTION", label: "Suggestion", icon: Lightbulb },
  { id: "BUG", label: "Bug Report", icon: Bug },
  { id: "FEEDBACK", label: "Feedback", icon: MessageSquare },
  { id: "FEATURE", label: "Feature Request", icon: Star },
];

function CategoryDropdown({
  value,
  onChange,
}: {
  value: Suggestion["category"];
  onChange: (v: Suggestion["category"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = CATEGORY_OPTIONS.find((c) => c.id === value);
  const ActiveIcon = active?.icon ?? MessageSquare;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground hover:border-primary/40 transition-colors"
      >
        <ActiveIcon className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 text-left">{active?.label}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1.5 w-full bg-card border border-border rounded-xl overflow-hidden shadow-lg shadow-black/20"
          >
            {CATEGORY_OPTIONS.map((cat) => {
              const Icon = cat.icon;
              const isActive = value === cat.id;
              return (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      onChange(cat.id as Suggestion["category"]);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left
                      ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {cat.label}
                    {isActive && (
                      <Check className="ml-auto w-5 h-5 rounded-full text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalContent({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (
    s: Omit<
      Suggestion,
      "id" | "votes" | "comments" | "status" | "author" | "createdAt"
    >,
  ) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<Suggestion["category"]>("SUGGESTION");

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) return;

    if (leoProfanity.check(title) || leoProfanity.check(description)) {
      toast.error("Your post contains inappropriate language.", {
        id: "post-toast",
      });
      return;
    }

    toast.loading("Creating post...", { id: "post-toast" });

    try {
      await onSubmit({ title, description, category });
      toast.success("Post created!", { id: "post-toast" });
      setTitle("");
      setDescription("");
      setCategory("SUGGESTION");
      onClose();
    } catch {
      toast.error("Something went wrong.", { id: "post-toast" });
    }
  }

  const titleHasProfanity = title.trim() ? leoProfanity.check(title) : false;

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors";

  return (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">New post</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Share an idea, report a bug, or leave feedback.
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </label>
        <CategoryDropdown value={category} onChange={setCategory} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Short and sweet..."
          maxLength={80}
          className={`${inputClass} ${titleHasProfanity ? "border-red-500/50 focus:border-red-500/70" : ""}`}
        />
        {titleHasProfanity && (
          <p className="text-xs text-red-400">
            Contains inappropriate language.
          </p>
        )}
        <span className="text-xs text-muted-foreground/50 text-right">
          {title.length}/80
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Description
        </label>
        <MarkdownEditor
          onChange={setDescription}
          value={description}
          maxLength={1000}
          rows={8}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim() || !description.trim()}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
        >
          <Send className="w-4 h-4" />
          Post
        </button>
      </div>
    </div>
  );
}

export function NewPostModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (
    s: Omit<
      Suggestion,
      "id" | "votes" | "comments" | "status" | "author" | "createdAt"
    >,
  ) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="modal-desktop"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 hidden sm:flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-background border border-border rounded-2xl shadow-xl shadow-black/30 max-h-[90vh] overflow-y-auto">
              <ModalContent onClose={onClose} onSubmit={onSubmit} />
            </div>
          </motion.div>

          <motion.div
            key="modal-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background border-t border-border rounded-t-2xl shadow-xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-0 sticky top-0 bg-background">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <ModalContent onClose={onClose} onSubmit={onSubmit} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
