"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import { MessageCircle, Send, CornerDownRight, Trash2 } from "lucide-react";
import { addComment, addReply, deleteComment } from "@/libs/suggestions";
import { Comment } from "@/types/types";
import { MarkdownRenderer } from "./mdRenderer";
import { signIn } from "@/libs/sign";

function Avatar({ name, image }: { name: string; image?: string }) {
  if (image)
    return (
      <Image
        src={image}
        alt={name}
        width={28}
        height={28}
        className="w-7 h-7 rounded-full shrink-0 mt-0.5"
      />
    );
  return (
    <div className="w-7 h-7 rounded-full bg-pink-950 border border-pink-900 flex items-center justify-center text-xs text-pink-400 font-medium shrink-0 mt-0.5">
      {name[0].toUpperCase()}
    </div>
  );
}

function CommentInput({
  onSubmit,
  placeholder = "Write a comment...",
  disabled,
  autoFocus,
  onCancel,
}: {
  onSubmit: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState("");
  function handle() {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input // here add markdown stuff too
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handle()}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-pink-500 transition-colors disabled:opacity-50"
        />
        <button
          onClick={handle}
          disabled={!value.trim() || disabled}
          className="px-4 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-3.5 h-3.5" />
          Post
        </button>
      </div>
      {onCancel && (
        <button
          onClick={onCancel}
          className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors w-fit"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

function CommentCard({
  comment,
  suggestionId,
  currentUserId,
  depth = 0,
  suggestionAuthorId,
}: {
  comment: Comment;
  suggestionId: string;
  currentUserId?: string;
  depth?: number;
  suggestionAuthorId: string;
}) {
  const [replying, setReplying] = useState(false);
  const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);
  const [isPending, startTransition] = useTransition();
  const [deleted, setDeleted] = useState(false);

  function handleDelete() {
    startTransition(async () => {
      await deleteComment(comment.id);
      setDeleted(true);
    });
  }

  function handleReply(content: string) {
    setReplying(false);
    startTransition(async () => {
      const newReply = await addReply(suggestionId, content, comment.id);
      setReplies((prev) => [...prev, newReply as unknown as Comment]);
    });
  }

  if (deleted) return null;

  return (
    <div className="flex flex-col gap-2">
      <div
        className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-3 ${depth > 0 ? "border-l-2 border-l-pink-900" : ""}`}
      >
        <Avatar name={comment.author.name} image={comment.author.image} />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-zinc-300">
              {comment.author.name}
            </span>
            {comment.author.role != "guest" && (
              <Image
                src={`/roles/${comment.author.role}.svg`}
                alt="a"
                height={16}
                width={16}
              />
            )}
            <span className="text-xs text-zinc-600">
              {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <MarkdownRenderer content={comment.content} />
          <div className="flex flex-row">
            {currentUserId && depth === 0 && (
              <button
                onClick={() => setReplying((v) => !v)}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-pink-400 transition-colors w-fit mt-1 mr-2"
              >
                <CornerDownRight className="w-3 h-3" />
                Reply
              </button>
            )}
            {currentUserId === suggestionAuthorId && (
              <button
                onClick={() => handleDelete()}
                className="flex items-center gap-1 text-xs text-zinc-600 hover:text-red-400 transition-colors w-fit mt-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {(replies.length > 0 || replying) && (
        <div className="ml-6 flex flex-col gap-2">
          {replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              suggestionAuthorId={suggestionAuthorId}
              suggestionId={suggestionId}
              currentUserId={currentUserId}
              depth={depth + 1}
            />
          ))}
          {replying && (
            <CommentInput
              placeholder={`Reply to ${comment.author.name}...`}
              onSubmit={handleReply}
              disabled={isPending}
              autoFocus
              onCancel={() => setReplying(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export function CommentsSection({
  suggestionId,
  initialComments,
  currentUserId,
  suggestionAuthorId,
}: {
  suggestionId: string;
  initialComments: Comment[];
  currentUserId?: string;
  suggestionAuthorId: string;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPending, startTransition] = useTransition();

  function handleNewComment(content: string) {
    startTransition(async () => {
      const newComment = await addComment(suggestionId, content);
      setComments((prev) => [...prev, newComment as unknown as Comment]);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest">
        Comments · {comments.length}
      </p>

      {comments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-zinc-600">
          <MessageCircle className="w-6 h-6" />
          <p className="text-sm">No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              suggestionAuthorId={suggestionAuthorId}
              suggestionId={suggestionId}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}

      {currentUserId ? (
        <CommentInput onSubmit={handleNewComment} disabled={isPending} />
      ) : (
        <p 
          className="text-sm text-zinc-600 text-center py-2 hover:text-primary decoration-primary hover:underline cursor-pointer"
          onClick={() => signIn("discord")}
        >
          Log in to leave a comment.
        </p>
      )}
    </div>
  );
}
