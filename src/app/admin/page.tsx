"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/libs/auth-client";
import { AuthSession, ManagedUser, Role } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ShieldCheck, Ban, Trash2, AlertTriangle, Search,
  Users, ArrowLeft, UserX, MessageSquare, ThumbsUp,
  Calendar, Mail, X, ExternalLink, Pencil,
} from "lucide-react";
import Link from "next/link";
import { RoleDropdown } from "@/components/manage/roleDropdown";
import { notFound } from "next/navigation";

function ModalShell({ open, onClose, children, maxWidth = "max-w-sm" }: {
  open: boolean; onClose: () => void; children: React.ReactNode; maxWidth?: string;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div key="m" initial={{ opacity: 0, scale: 0.97, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }} transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <div className={`pointer-events-auto w-full ${maxWidth} bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden`}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Ban Modal ──────────────────────────────────────────────────────────────────
function BanModal({ open, onClose, onConfirm, user }: {
  open: boolean; onClose: () => void; onConfirm: (reason: string) => void; user: ManagedUser | null;
}) {
  const [reason, setReason] = useState("");
  return (
    <ModalShell open={open && !!user} onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <Ban className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Ban {user?.name}</h2>
            <p className="text-xs text-zinc-500 mt-0.5 leading-5">They won&apos;t be able to post or comment.</p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Reason</label>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)}
            placeholder="Why are you banning this user?" rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 resize-none transition-colors" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(reason); setReason(""); }} disabled={!reason.trim()}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Ban className="w-3.5 h-3.5" /> Ban user
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Delete Posts Modal ─────────────────────────────────────────────────────────
function DeletePostsModal({ open, onClose, onConfirm, user }: {
  open: boolean; onClose: () => void; onConfirm: () => void; user: ManagedUser | null;
}) {
  return (
    <ModalShell open={open && !!user} onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Delete all posts by {user?.name}</h2>
            <p className="text-xs text-zinc-500 mt-0.5 leading-5">
              Removes {user?._count.suggestions} post{user?._count.suggestions !== 1 ? "s" : ""} and {user?._count.comments} comment{user?._count.comments !== 1 ? "s" : ""}. Cannot be undone.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Delete all
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ── Delete Account Modal ───────────────────────────────────────────────────────
function DeleteAccountModal({ open, onClose, onConfirm, user }: {
  open: boolean; onClose: () => void; onConfirm: () => void; user: ManagedUser | null;
}) {
  const [confirm, setConfirm] = useState("");
  return (
    <ModalShell open={open && !!user} onClose={onClose}>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <UserX className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Delete account</h2>
            <p className="text-xs text-zinc-500 mt-0.5 leading-5">
              Permanently deletes <span className="text-zinc-300">{user?.name}</span>&apos;s account and all data.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Type <span className="text-zinc-300 normal-case font-mono">{user?.name}</span> to confirm
          </label>
          <input value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder={user?.name}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/40 transition-colors" />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); setConfirm(""); }} disabled={confirm !== user?.name}
            className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <UserX className="w-3.5 h-3.5" /> Delete account
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function UserProfileModal({ open, onClose, user }: {
  open: boolean; onClose: () => void; user: ManagedUser | null;
}) {
  return (
    <ModalShell open={open && !!user} onClose={onClose}>
      {user && (
        <>
          {/* Cover */}
          <div className="h-20 bg-linear-to-br from-primary/15 via-zinc-900 to-zinc-950 relative border-b border-zinc-800/50">
            <button onClick={onClose} className="absolute top-3 right-3 text-zinc-600 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-5 pb-5">
            {/* Avatar */}
            <div className="-mt-5 mb-4">
              {user.image ? (
                <Image src={user.image} alt={user.name} width={52} height={52}
                  className="rounded-full border-2 border-zinc-950" />
              ) : (
                <div className="w-13 h-13 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm font-semibold text-zinc-300">
                  {user.name[0]}
                </div>
              )}
            </div>
            {/* Name */}
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-white">{user.name}</h2>
                  {user.role !== "guest" && (
                    <Image src={`/roles/${user.role}.svg`} alt={user.role} height={16} width={16} />
                  )}
                </div>
                <p className="text-xs text-zinc-500 capitalize mt-0.5">{user.role}</p>
              </div>
              {user.banned && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">banned</span>
              )}
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: MessageSquare, label: "Posts", value: user._count.suggestions },
                { icon: MessageSquare, label: "Comments", value: user._count.comments },
                { icon: ThumbsUp, label: "Votes", value: user._count.votes ?? 0 },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-xs text-zinc-600 mb-0.5">{s.label}</p>
                  <p className="text-sm font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>
            {/* Details */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="w-3.5 h-3.5 shrink-0 text-zinc-600" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              {user.banned && user.bannedReason && (
                <div className="flex items-start gap-2 text-xs text-red-400/70 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 mt-1">
                  <Ban className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{user.bannedReason}</span>
                </div>
              )}
            </div>
            <Link href={`/?author=${user.id}`} onClick={onClose}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-zinc-800 text-xs text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> View posts
            </Link>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ── Edit Modal ─────────────────────────────────────────────────────────────────
function UserEditModal({ open, onClose, onSave, user }: {
  open: boolean; onClose: () => void;
  onSave: (userId: string, data: { name: string; email: string; image?: string }) => void;
  user: ManagedUser | null;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const hasChanges = name !== user?.name || email !== user?.email || imageFile !== null;

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file."); return; }
    if (file.size > 20 * 1024 * 1024) { toast.error("Image must be less than 20MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
    setImageFile(file);
  }

  async function handleSave() {
    if (!user || !hasChanges) return;
    setSaving(true);
    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        const formData = new FormData();
        formData.append("file", imageFile);
        const { data } = await axios.post("/api/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
        imageUrl = data.url;
      } catch { toast.error("Failed to upload image."); setSaving(false); return; }
    }
    await onSave(user.id, { name, email, ...(imageUrl !== undefined && { image: imageUrl }) });
    setSaving(false);
  }

  return (
    <ModalShell open={open && !!user} onClose={onClose}>
      {user && (
        <>
          <div className="h-16 bg-linear-to-br from-primary/15 via-zinc-900 to-zinc-950 relative border-b border-zinc-800/50">
            <button onClick={onClose} className="absolute top-3 right-3 text-zinc-600 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="px-5 pb-5">
            {/* Avatar */}
            <div className="relative -mt-5 mb-4 group w-fit">
              {imagePreview ? (
                <Image src={imagePreview} alt={user.name} width={52} height={52} className="rounded-full border-2 border-zinc-950 w-13 h-13 object-cover" />
              ) : (
                <div className="w-13 h-13 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-sm font-semibold text-zinc-300">
                  {name[0] || user.name[0]}
                </div>
              )}
              <label className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center">
                <Pencil className="w-3.5 h-3.5 text-white" />
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            </div>

            <h2 className="text-sm font-semibold text-white mb-0.5">Edit {user.name}</h2>
            <p className="text-xs text-zinc-500 mb-5">Update user details.</p>

            <div className="flex flex-col gap-4 mb-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-600 bg-zinc-900/50 rounded-lg p-3 border border-zinc-800/50">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-zinc-700" />
                <span>Role is <span className="text-zinc-400 capitalize">{user.role}</span>. Use the role dropdown to change it.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800/50">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!hasChanges || saving}
                className="flex items-center gap-2 bg-primary hover:opacity-90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
                {saving ? (
                  <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : <Pencil className="w-3.5 h-3.5" />}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </>
      )}
    </ModalShell>
  );
}

// ── User Row ───────────────────────────────────────────────────────────────────
function UserRow({ user, currentUserId, onRoleChange, onBan, onUnban, onDeletePosts, onEditAccount, onDeleteAccount, onViewProfile }: {
  user: ManagedUser; currentUserId?: string;
  onRoleChange: (userId: string, role: Role) => void;
  onBan: (user: ManagedUser) => void; onUnban: (userId: string) => void;
  onDeletePosts: (user: ManagedUser) => void; onDeleteAccount: (user: ManagedUser) => void;
  onEditAccount: (user: ManagedUser) => void; onViewProfile: (user: ManagedUser) => void;
}) {
  const isSelf = user.id === currentUserId;

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all
        ${user.banned ? "border-red-500/15 bg-red-500/3" : "border-zinc-800/80 bg-zinc-950 hover:border-zinc-700"}`}>
      <button onClick={() => onViewProfile(user)} className="relative shrink-0 group">
        {user.image ? (
          <Image src={user.image} alt={user.name} width={34} height={34} className="rounded-full group-hover:opacity-75 transition-opacity" />
        ) : (
          <div className="w-8.5 h-8.5 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-400 group-hover:bg-zinc-700 transition-colors">
            {user.name[0]}
          </div>
        )}
        {user.banned && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-zinc-950 flex items-center justify-center">
            <Ban className="w-1.5 h-1.5 text-white" />
          </div>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => onViewProfile(user)} className="text-sm font-medium text-zinc-200 hover:text-primary transition-colors truncate">
            {user.name}
          </button>
          {isSelf && <span className="text-xs px-1.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-500">you</span>}
          {user.banned && <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">banned</span>}
          {user.role !== "guest" && (
            <Image src={`/roles/${user.role}.svg`} alt={user.role} width={14} height={14} className="opacity-80" />
          )}
        </div>
        <p className="text-xs text-zinc-600 truncate mt-0.5">{user.email}</p>
        <p className="text-xs text-zinc-700 mt-0.5">{user._count.suggestions} posts · {user._count.comments} comments</p>
        {user.banned && user.bannedReason && (
          <p className="text-xs text-red-400/60 mt-0.5 truncate">↳ {user.bannedReason}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <RoleDropdown value={user.role} onChange={(role) => onRoleChange(user.id, role)} disabled={isSelf} />
        <div className="flex items-center gap-0.5">
          <button onClick={() => onEditAccount(user)} title="Edit"
            className="p-1.5 rounded-lg text-zinc-600 hover:text-zinc-200 hover:bg-zinc-800 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          {user.banned ? (
            <button onClick={() => onUnban(user.id)} title="Unban"
              className="p-1.5 rounded-lg text-zinc-600 hover:text-green-400 hover:bg-green-500/10 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button onClick={() => onBan(user)} title="Ban" disabled={isSelf}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <Ban className="w-3.5 h-3.5" />
            </button>
          )}
          <button onClick={() => onDeletePosts(user)} title="Delete posts" disabled={isSelf}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDeleteAccount(user)} title="Delete account" disabled={isSelf}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
            <UserX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ManagePage() {
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "banned" | "admin" | "staff" | "guest" | "contributor" | "developer">("all");
  const [banTarget, setBanTarget] = useState<ManagedUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [deleteAccountTarget, setDeleteAccountTarget] = useState<ManagedUser | null>(null);
  const [profileTarget, setProfileTarget] = useState<ManagedUser | null>(null);
  const [profileEditTarget, setProfileEditTarget] = useState<ManagedUser | null>(null);

  useEffect(() => { authClient.getSession().then((s) => setSession(s as AuthSession)); }, []);
  useEffect(() => {
    axios.get("/api/admin/users")
      .then((res) => setUsers(res.data.data))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  async function handleRoleChange(userId: string, role: Role) {
    toast.loading("Updating role...", { id: "role-toast" });
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role } : u));
      toast.success("Role updated.", { id: "role-toast" });
    } catch { toast.error("Failed to update role.", { id: "role-toast" }); }
  }

  async function handleEditUser(userId: string, data: { name: string; email: string; image?: string }) {
    toast.loading("Saving...", { id: "edit-toast" });
    try {
      await axios.patch(`/api/admin/users/${userId}`, data);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, ...data } : u));
      toast.success("User updated.", { id: "edit-toast" });
      setProfileEditTarget(null);
    } catch { toast.error("Failed to update user.", { id: "edit-toast" }); }
  }

  async function handleBan(reason: string) {
    if (!banTarget) return;
    toast.loading("Banning user...", { id: "ban-toast" });
    try {
      await axios.post(`/api/admin/users/${banTarget.id}/ban`, { reason });
      setUsers((prev) => prev.map((u) => u.id === banTarget.id ? { ...u, banned: true, bannedReason: reason } : u));
      toast.success("User banned.", { id: "ban-toast" });
      setBanTarget(null);
    } catch { toast.error("Failed to ban user.", { id: "ban-toast" }); }
  }

  async function handleUnban(userId: string) {
    toast.loading("Unbanning user...", { id: "unban-toast" });
    try {
      await axios.delete(`/api/admin/users/${userId}/ban`);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, banned: false, bannedReason: null } : u));
      toast.success("User unbanned.", { id: "unban-toast" });
    } catch { toast.error("Failed to unban user.", { id: "unban-toast" }); }
  }

  async function handleDeletePosts() {
    if (!deleteTarget) return;
    toast.loading("Deleting posts...", { id: "delete-toast" });
    try {
      await axios.delete(`/api/admin/users/${deleteTarget.id}/posts`);
      setUsers((prev) => prev.map((u) => u.id === deleteTarget.id ? { ...u, _count: { ...u._count, suggestions: 0, comments: 0 } } : u));
      toast.success("Posts deleted.", { id: "delete-toast" });
      setDeleteTarget(null);
    } catch { toast.error("Failed to delete posts.", { id: "delete-toast" }); }
  }

  async function handleDeleteAccount() {
    if (!deleteAccountTarget) return;
    toast.loading("Deleting account...", { id: "daccount-toast" });
    try {
      await axios.delete(`/api/admin/users/${deleteAccountTarget.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== deleteAccountTarget.id));
      toast.success("Account deleted.", { id: "daccount-toast" });
      setDeleteAccountTarget(null);
    } catch { toast.error("Failed to delete account.", { id: "daccount-toast" }); }
  }

  const FILTERS = [
    { id: "all", label: "All", count: users.length },
    { id: "banned", label: "Banned", count: users.filter((u) => u.banned).length },
    { id: "contributor", label: "Contributors", count: users.filter((u) => u.role === "contributor").length },
    { id: "staff", label: "Staff", count: users.filter((u) => u.role === "staff").length },
    { id: "developer", label: "Developers", count: users.filter((u) => u.role === "developer").length },
    { id: "guest", label: "Customers", count: users.filter((u) => u.role === "guest").length },
    { id: "admin", label: "Admins", count: users.filter((u) => u.role === "admin" || u.role === "owner").length },
  ] as const;

  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "banned" && u.banned) || (filter === "staff" && u.role === "staff") ||
      (filter === "contributor" && u.role === "contributor") || (filter === "developer" && u.role === "developer") ||
      (filter === "guest" && u.role === "guest") || (filter === "admin" && (u.role === "admin" || u.role === "owner"));
    return matchesSearch && matchesFilter;
  });

  if (session === undefined) return null;
  if (!session?.data?.user || (session.data.user.role !== "admin" && session.data.user.role !== "owner")) return notFound();

  return (
    <div className="min-h-screen bg-black">
      <BanModal open={!!banTarget} onClose={() => setBanTarget(null)} onConfirm={handleBan} user={banTarget} />
      <DeletePostsModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDeletePosts} user={deleteTarget} />
      <DeleteAccountModal open={!!deleteAccountTarget} onClose={() => setDeleteAccountTarget(null)} onConfirm={handleDeleteAccount} user={deleteAccountTarget} />
      <UserProfileModal open={!!profileTarget} onClose={() => setProfileTarget(null)} user={profileTarget} />
      <UserEditModal open={!!profileEditTarget} onClose={() => setProfileEditTarget(null)} user={profileEditTarget} onSave={handleEditUser} key={profileEditTarget?.id ?? "empty"} />

      <main className="mx-auto max-w-4xl px-4 py-24 md:py-32 flex flex-col gap-8">
        {/* Header */}
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-300 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to suggestions
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Manage</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Users, roles & moderation.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total users", value: users.length },
            { label: "Banned", value: users.filter((u) => u.banned).length },
            { label: "Admins", value: users.filter((u) => u.role === "admin" || u.role === "owner").length },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
              <p className="text-xs text-zinc-600 mb-1">{s.label}</p>
              <p className="text-xl font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-950 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border
                  ${filter === f.id ? "bg-primary/10 text-primary border-primary/30" : "text-zinc-500 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300"}`}>
                {f.label}
                <span className={`px-1.5 py-0.5 rounded text-xs ${filter === f.id ? "bg-primary/20 text-primary" : "bg-zinc-900 text-zinc-600"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3 h-3 text-zinc-700" />
            <p className="text-xs text-zinc-600">{filtered.length} user{filtered.length !== 1 ? "s" : ""}</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <svg aria-hidden="true" className="w-6 h-6 text-zinc-800 animate-spin fill-primary" viewBox="0 0 100 101" fill="none">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-700 gap-2">
              <Users className="w-7 h-7" />
              <p className="text-sm">No users found.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((user) => (
                <UserRow key={user.id} user={user} currentUserId={session?.data?.user?.id}
                  onRoleChange={handleRoleChange} onBan={setBanTarget} onUnban={handleUnban}
                  onEditAccount={setProfileEditTarget} onDeletePosts={setDeleteTarget}
                  onDeleteAccount={setDeleteAccountTarget} onViewProfile={setProfileTarget} />
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}