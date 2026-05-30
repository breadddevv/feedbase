"use client";
import { Suggestion } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bug,
  ChevronDown,
  Lightbulb,
  MessageSquare,
  Star,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { leoProfanity, MarkdownEditor } from "@/components/markdownEditor"; // extract or duplicate
import toast from "react-hot-toast";
import axios from "axios";
leoProfanity.loadDictionary("en")

const CATEGORY_OPTIONS = [
  { id: "SUGGESTION", label: "Suggestion", icon: Lightbulb },
  { id: "BUG", label: "Bug Report", icon: Bug },
  { id: "FEEDBACK", label: "Feedback", icon: MessageSquare },
  { id: "FEATURE", label: "Feature Request", icon: Star },
];

function Dropdown<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { id: string; label: string; icon?: React.ElementType }[];
}) {
  const [open, setOpen] = useState(false);
  const active = options.find((o) => o.id === value);
  const ActiveIcon = active?.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-200 hover:border-zinc-600 transition-colors"
      >
        {ActiveIcon && (
          <ActiveIcon className="w-4 h-4 text-zinc-400 shrink-0" />
        )}
        <span className="flex-1 text-left">{active?.label}</span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-10 mt-1.5 w-full bg-zinc-800 border border-zinc-700 rounded-lg overflow-hidden shadow-xl"
          >
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = value === opt.id;
              return (
                <li key={opt.id}>
                  <button
                    onClick={() => {
                      onChange(opt.id as T);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-left
                      ${isActive ? "bg-primary/10 text-primary" : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"}`}
                  >
                    {Icon && <Icon className="w-4 h-4 shrink-0" />}
                    {opt.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
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

export function EditSuggestionModal({
  open,
  onClose,
  suggestion,
  onUpdated,
}: {
  open: boolean;
  onClose: () => void;
  suggestion: Suggestion;
  onUpdated: (updated: Suggestion) => void;
}) {
  const [title, setTitle] = useState(suggestion.title);
  const [description, setDescription] = useState(suggestion.description);
  const [category, setCategory] = useState(suggestion.category);

  async function handleSave() {
    if (!title.trim() || !description.trim()) return;

    if (leoProfanity.check(title) || leoProfanity.check(description)) {
      toast.error("Your post contains inappropriate language.", {
        id: "post-toast",
      });
      return;
    }
    toast.loading("Saving changes...", { id: "edit-toast" });
    try {
      const res = await axios.patch(`/api/suggestion/${suggestion.id}`, {
        title,
        description,
        category,
        status,
      });
      onUpdated(res.data.data);
      toast.success("Changes saved!", { id: "edit-toast" });
      onClose();
    } catch {
      toast.error("Failed to save.", { id: "edit-toast" });
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-zinc-700 bg-zinc-800 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors";

  const content = (
    <div className="p-6 flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Edit post</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Make changes to your suggestion.</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-600 hover:text-zinc-300 transition-colors p-1 rounded-md hover:bg-zinc-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Category</label>
          <Dropdown value={category} onChange={setCategory} options={CATEGORY_OPTIONS} />
        </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={80}
          className={inputClass}
        />
        <span className="text-xs text-zinc-600 text-right">{title.length}/80</span>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Description</label>
        <MarkdownEditor
          value={description}
          onChange={setDescription}
          placeholder="Describe your idea..."
          maxLength={1000}
          rows={8}
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!title.trim() || !description.trim()}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Check className="w-4 h-4" />
          Save changes
        </button>
      </div>
    </div>
  );

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
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Desktop */}
          <motion.div
            key="modal-desktop"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 hidden sm:flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
              {content}
            </div>
          </motion.div>

          {/* Mobile sheet */}
          <motion.div
            key="modal-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-zinc-950 border-t border-zinc-800 rounded-t-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3">
              <div className="w-10 h-1 rounded-full bg-zinc-700" />
            </div>
            {content}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}