"use client";
import { SuggestionActions } from "@/components/suggestionAction";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  Star,
  ArrowLeft,
  Pencil,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AuthSession, Suggestion } from "@/types/types";
import { authClient } from "@/libs/auth-client";
import axios from "axios";
import { useParams, notFound, useRouter } from "next/navigation";
import { CommentsSection } from "@/components/commentsSection";
import TimeAgo from "javascript-time-ago";
import "javascript-time-ago/locale/en";
import { MarkdownRenderer } from "@/components/mdRenderer";
import { EditSuggestionModal } from "@/components/editModal";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { hasManagementAccess } from "@/libs/permissions";

const CATEGORY_ICONS = {
  SUGGESTION: Lightbulb,
  BUG: Bug,
  FEEDBACK: MessageSquare,
  FEATURE: Star,
};

type SuggestionStatus = "PENDING" | "PLANNED" | "IN_PROGRESS" | "DONE";

const STATUS_OPTIONS: { id: SuggestionStatus; label: string; color: string }[] =
  [
    { id: "PENDING", label: "Pending", color: "bg-zinc-800 text-zinc-400" },
    {
      id: "PLANNED",
      label: "Planned",
      color: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    },
    {
      id: "IN_PROGRESS",
      label: "In Progress",
      color: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    },
    {
      id: "DONE",
      label: "Done",
      color: "bg-green-500/10 text-green-400 border border-green-500/20",
    },
  ];

function StatusBadge({ status }: { status: string }) {
  const opt = STATUS_OPTIONS.find((s) => s.id === status);
  return (
    <span
      className={`text-xs px-2.5 py-0.5 rounded-full font-medium capitalize ${opt?.color ?? "bg-zinc-800 text-zinc-400"}`}
    >
      {opt?.label ?? status.toLowerCase().replace("_", " ")}
    </span>
  );
}

function StatusDropdown({
  value,
  onChange,
}: {
  value: SuggestionStatus;
  onChange: (s: SuggestionStatus) => void;
}) {
  const [open, setOpen] = useState(false);
  const active = STATUS_OPTIONS.find((s) => s.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-200 hover:border-zinc-600 transition-colors"
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            value === "DONE"
              ? "bg-green-400"
              : value === "IN_PROGRESS"
                ? "bg-yellow-400"
                : value === "PLANNED"
                  ? "bg-blue-400"
                  : "bg-zinc-500"
          }`}
        />
        {active?.label}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-36 bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden shadow-xl z-99"
          >
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.id}>
                <button
                  onClick={() => {
                    onChange(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors text-left
                    ${value === opt.id ? "bg-zinc-800/30 backdrop-blur-2xl text-white" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      opt.id === "DONE"
                        ? "bg-green-400"
                        : opt.id === "IN_PROGRESS"
                          ? "bg-yellow-400"
                          : opt.id === "PLANNED"
                            ? "bg-blue-400"
                            : "bg-zinc-500"
                    }`}
                  />
                  {opt.label}
                  {value === opt.id && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function DeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isPending: boolean;
}) {
  const content = (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Delete post</h2>
          <p className="text-xs text-zinc-500 mt-1 leading-5">
            Are you sure you want to delete{" "}
            <span className="text-zinc-300 font-medium">
              &quot;{title}&quot;
            </span>
            ? This cannot be undone.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={onClose}
          disabled={isPending}
          className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex items-center gap-2 bg-red-800 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {isPending ? "Deleting..." : "Delete"}
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
            onClick={!isPending ? onClose : undefined}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 hidden sm:flex items-center justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-zinc-950 border border-zinc-800 rounded-2xl shadow-xl overflow-hidden">
              {content}
            </div>
          </motion.div>
          <motion.div
            key="modal-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-zinc-950 border-t border-zinc-800 rounded-t-2xl"
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

export default function SuggestionPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound404, setNotFound404] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletesPending, setDeletePending] = useState(false);
  const timeAgo = new TimeAgo("en");

  useEffect(() => {
    authClient.getSession().then((s) => setSession(s as AuthSession));
  }, []);

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await axios.get(`/api/feedback/${params.slug}`);
        console.log(res.data);
        setSuggestion(res.data.data);
      } catch {
        setNotFound404(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSuggestion();
  }, [params.slug]);

  async function handleDelete() {
    if (!suggestion) return;
    setDeletePending(true);
    toast.loading("Deleting post...", { id: "delete-toast" });
    try {
      await axios.delete(`/api/feedback/${suggestion.slug}`);
      toast.success("Post deleted.", { id: "delete-toast" });
      router.push("/");
    } catch {
      toast.error("Failed to delete.", { id: "delete-toast" });
      setDeletePending(false);
      setDeleteOpen(false);
    }
  }

  async function handleStatusChange(status: SuggestionStatus) {
    if (!suggestion) return;
    toast.loading("Updating status...", { id: "status-toast" });
    try {
      await axios.patch(`/api/feedback/${suggestion.slug}`, { status });
      setSuggestion((prev) => (prev ? { ...prev, status } : prev));
      toast.success("Status updated.", { id: "status-toast" });
    } catch {
      toast.error("Failed to update status.", { id: "status-toast" });
    }
  }

  if (loading)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg
          aria-hidden="true"
          className="inline w-12 h-12 text-primary/20 animate-spin fill-primary"
          viewBox="0 0 100 101"
          fill="none"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </div>
    );

  if (notFound404 || !suggestion) return notFound();

  const isOwner = session?.data?.user?.id === suggestion.author.id;
  const manageAccess = session?.data
    ? (hasManagementAccess(session) ?? false)
    : false;
  const canEdit = isOwner;
  const canDelete = isOwner || manageAccess;
  const canChangeStatus = manageAccess;
  const CategoryIcon =
    CATEGORY_ICONS[suggestion.category as keyof typeof CATEGORY_ICONS] ??
    MessageSquare;
  const hasVoted = suggestion.votes?.some(
    (v) => v.authorId === session?.data?.user?.id,
  );

  return (
    <div className="min-h-screen bg-black">
      <EditSuggestionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        suggestion={suggestion}
        onUpdated={(updated) => setSuggestion(updated)}
      />
      <DeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title={suggestion.title}
        isPending={deletesPending}
      />

      <main className="mx-auto max-w-5xl px-4 py-24 md:py-32 flex flex-col gap-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to suggestions
        </Link>

        <div className="flex items-start gap-6">
          <div className="flex flex-col items-center justify-center gap-1 px-3 py-5  border group hover:text-primary hover:bg-primary/10 transition-colors hover:border-primary/40 border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg min-w-11">
            {" "}
            {/** votes */}
            <button className="transition-colors text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <ChevronUp className="w-6 h-6 group-hover:text-primary transition-colors" />
            </button>
            <span className="text-sm font-semibold leading-none">0</span>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {" "}
            {/** suggestion stuff */}
            <div className="flex flex-col gap-3">
              {" "}
              {/** title and meta */}
              <p className="text-2xl font-bold">{suggestion.title}</p>
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <Image
                  src={suggestion.author.image}
                  alt={suggestion.author.name}
                  width={20}
                  height={20}
                  className="rounded-full w-5 h-5 object-cover shrink-0"
                />
                Posted by{" "}
                <span className="font-medium text-white">
                  {suggestion.author.name}
                </span>
                {" · "}
                {timeAgo.format(new Date(suggestion.createdAt))}
              </div>
            </div>
            <MarkdownRenderer content={suggestion.description} />
          </div>
        </div>

        <CommentsSection
          suggestionId={suggestion.id}
          suggestionAuthorId={suggestion.author.id}
          initialComments={suggestion.comments}
          currentUserId={session?.data?.user?.id}
        />
      </main>
    </div>
  );
}
