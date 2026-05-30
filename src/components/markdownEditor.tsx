// components/MarkdownEditor.tsx
"use client";
import {
  Bold, Italic, Code, Link, List, ListOrdered,
  Eye, Pencil, Heading2, Heading3, Minus, Quote, AlertTriangle,
} from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MarkdownRenderer } from "@/components/mdRenderer";
import leoProfanity from "leo-profanity";

leoProfanity.loadDictionary("en");

type ToolbarAction = {
  icon: React.ElementType;
  label: string;
  action: (text: string, sel: { start: number; end: number }) => { value: string; cursor: number };
};

const TOOLBAR: (ToolbarAction | "divider")[] = [
  {
    icon: Heading2,
    label: "Heading 2",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "## " + text.slice(start);
      return { value, cursor: start + 3 };
    },
  },
  {
    icon: Heading3,
    label: "Heading 3",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "### " + text.slice(start);
      return { value, cursor: start + 4 };
    },
  },
  "divider",
  {
    icon: Bold,
    label: "Bold",
    action: (text, { start, end }) => {
      const selected = text.slice(start, end) || "bold text";
      const value = text.slice(0, start) + `**${selected}**` + text.slice(end);
      return { value, cursor: start + selected.length + 4 };
    },
  },
  {
    icon: Italic,
    label: "Italic",
    action: (text, { start, end }) => {
      const selected = text.slice(start, end) || "italic text";
      const value = text.slice(0, start) + `*${selected}*` + text.slice(end);
      return { value, cursor: start + selected.length + 2 };
    },
  },
  {
    icon: Code,
    label: "Inline code",
    action: (text, { start, end }) => {
      const selected = text.slice(start, end) || "code";
      const value = text.slice(0, start) + "`" + selected + "`" + text.slice(end);
      return { value, cursor: start + selected.length + 2 };
    },
  },
  "divider",
  {
    icon: Link,
    label: "Link",
    action: (text, { start, end }) => {
      const selected = text.slice(start, end) || "link text";
      const value = text.slice(0, start) + `[${selected}](url)` + text.slice(end);
      return { value, cursor: start + selected.length + 7 };
    },
  },
  {
    icon: Quote,
    label: "Blockquote",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "> " + text.slice(start);
      return { value, cursor: start + 2 };
    },
  },
  {
    icon: Minus,
    label: "Divider",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "\n---\n" + text.slice(start);
      return { value, cursor: start + 5 };
    },
  },
  "divider",
  {
    icon: List,
    label: "Bullet list",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "- " + text.slice(start);
      return { value, cursor: start + 2 };
    },
  },
  {
    icon: ListOrdered,
    label: "Numbered list",
    action: (text, { start }) => {
      const value = text.slice(0, start) + "1. " + text.slice(start);
      return { value, cursor: start + 3 };
    },
  },
];

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write something...",
  maxLength = 1000,
  rows = 8,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}) {
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyAction(action: ToolbarAction["action"]) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const { value: newValue, cursor } = action(value, { start, end });
    onChange(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(cursor, cursor);
    });
  }

  const hasProfanity = value.trim() ? leoProfanity.check(value) : false;

  return (
    <div className={`flex flex-col rounded-xl border bg-card overflow-hidden transition-colors
      ${hasProfanity
        ? "border-red-500/50 focus-within:border-red-500/70"
        : "border-border focus-within:border-primary/40"
      }`}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-border bg-muted/30">
        <div className="flex items-center gap-0.5 flex-wrap">
          {TOOLBAR.map((tool, i) =>
            tool === "divider" ? (
              <span key={i} className="w-px h-4 bg-border mx-1" />
            ) : (
              <button
                key={tool.label}
                type="button"
                title={tool.label}
                onClick={() => applyAction(tool.action)}
                disabled={preview}
                className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <tool.icon className="w-3.5 h-3.5" />
              </button>
            )
          )}
        </div>

        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors shrink-0
            ${preview
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
        >
          {preview ? <Pencil className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {/* Editor / Preview */}
      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="min-h-32 px-4 py-3"
          >
            {value ? (
              <MarkdownRenderer content={value} />
            ) : (
              <span className="text-muted-foreground/40 text-sm">Nothing to preview.</span>
            )}
          </motion.div>
        ) : (
          <motion.textarea
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            maxLength={maxLength}
            className="px-4 py-3 text-sm text-foreground bg-transparent placeholder:text-muted-foreground/40 focus:outline-none resize-none font-mono leading-7"
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-muted/30">
        {hasProfanity ? (
          <span className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertTriangle className="w-3 h-3" />
            Contains inappropriate language
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/40">
            **bold** · *italic* · `code` · [link](url) · ## heading
          </span>
        )}
        <span className="text-xs text-muted-foreground/40">
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  );
}

// export so parent can check before submitting
export { leoProfanity };