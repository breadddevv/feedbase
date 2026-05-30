import { Bug, Lightbulb, MessageSquare, Star, ShieldCheck, Kanban, List } from "lucide-react";
import Link from "next/link";

const VIEWS = [
  { id: "kanban", label: "Kanban View", icon: Kanban },
  { id: "list", label: "List View", icon: List },
];

export default function Sidebar({
  activeCategory,
  setActiveCategory,
  isAdmin = false,
}: {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  isAdmin?: boolean;
}) {
  return (
    <aside className="w-56 shrink-0 flex-col gap-1 hidden md:flex">
      <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">
        Categories
      </p>
      {VIEWS.map((cat) => {
        const Icon = cat.icon;
        const isActive = activeCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left
              ${isActive ? "bg-primary text-white" : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{cat.label}</span>
          </button>
        );
      })}

      {isAdmin && (
        <div className="mt-6">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider px-3 mb-2">
            Admin
          </p>
          <Link
            href="/manage"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left text-primary hover:bg-primary/10"
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="flex-1">Manage</span>
          </Link>
        </div>
      )}
    </aside>
  );
}