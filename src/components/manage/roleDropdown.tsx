"use client";
import { Role } from "@/types/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ROLES: { id: Role; label: string }[] = [
  { id: "guest", label: "Guest" },
  { id: "admin", label: "Admin" },
  { id: "owner", label: "Owner" },
  { id: "contributor", label: "Contributor" },
  { id: "developer", label: "Developer" },
  { id: "staff", label: "Team Boostify" },
];

const ROLE_STYLES: Record<Role, string> = {
  guest: "bg-zinc-800 text-zinc-400",
  admin: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  owner: "bg-pink-400/10 text-pink-400 border border-pink-400/20",
  contributor: "bg-amber-400/10 text-amber-600 border border-amber-200/20",
  developer: "bg-pink-800/10 text-pink-600 border border-pink-800/60",
  staff: "bg-primary/10 text-primary border border-primary/60"
};

const DOT_STYLES: Record<Role, string> = {
  guest: "bg-zinc-100",
  admin: "bg-blue-500",
  owner: "bg-primary",
  contributor: "bg-amber-200",
  developer: "bg-pink-600",
  staff: "bg-primary"
};

export function RoleDropdown({
  value,
  onChange,
  disabled,
}: {
  value: Role;
  onChange: (r: Role) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const active = ROLES.find((r) => r.id === value);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${ROLE_STYLES[value]} text-xs font-medium text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <span className="flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs font-medium">
          <span className={`w-1.5 h-1.5 rounded-full ${DOT_STYLES[value]} shrink-0`} />
          {active?.label}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronDown className="w-3 h-3 text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-1.5 w-44 bg-zinc-950/30 backdrop-blur-xs border border-zinc-800 rounded-xl overflow-hidden shadow-xl z-20"
          >
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  onChange(role.id);
                  setOpen(false);
                }}
                className={`w-full flex flex-col px-3 py-2.5 text-left transition-colors hover:bg-zinc-800
                  ${value === role.id ? "bg-zinc-800/60" : ""}`}
              >
                <span className="text-xs font-medium text-zinc-200">
                  {role.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
