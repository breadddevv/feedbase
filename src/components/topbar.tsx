"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X, LogOut, ChevronDown, RefreshCcw } from "lucide-react";
import Image from "next/image";
import { signIn } from "@/libs/sign";
import { authClient } from "@/libs/auth-client";
import toast from "react-hot-toast";
import axios from "axios";
import { resolveOAuth } from "@/libs/resolveOAuth";

const navLinks = [
  { name: "Roadmap", href: "/" },
  { name: "Feedback", href: "/feedback" },
  { name: "Support Cases", href: "/support" },
  { name: "Bug Reports", href: "/bugs" },
  { name: "Changelogs", href: "/changelogs" }
];

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Session {
  token: string;
  ipAddress: string;
  userAgent: string;
}

interface AuthSession {
  data: {
    session: Session;
    user: User;
  } | null;
  error: null | Error;
}

function UserDropdown({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    setOpen(false);
    window.location.reload();
  }

  async function handleRefresh() {
    toast.loading("Updating your role...", { id: "update-toast" });
    try {
      await axios.post("/api/auth/me/update-roles");
      toast.success("Roles updated successfully.", { id: "update-toast" });
    } catch {
      toast.error("Failed to update role.", { id: "update-toast" });
    }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Image
          src={user.image}
          alt={user.name}
          width={28}
          height={28}
          className="rounded-full"
        />
        <span className="text-sm font-medium">{user.name}</span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-52 bg-black/90 backdrop-blur-xl border border-border/50 rounded-xl shadow-lg overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-border/50">
              <p className="flex text-sm font-medium truncate">
                {user.name}
                {user.role != "guest" && (
                  <Image
                    src={`/roles/${user.role}.svg`}
                    alt="a"
                    height={16}
                    width={16}
                    className="ml-1"
                  />
                )}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
            <div className="p-1">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                Refresh Roles
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    authClient.getSession().then((s) => setSession(s as AuthSession));
  }, []);

  async function handleRefresh() {
    toast.loading("Updating your role...", { id: "update-toast" });
    try {
      await axios.post("/api/auth/me/update-roles");
      toast.success("Roles updated successfully.", { id: "update-toast" });
    } catch {
      toast.error("Failed to update role.", { id: "update-toast" });
    }
  }

  const user = session?.data?.user;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              width={48}
              height={8}
              alt=""
            />
          </Link>

          <div className="hidden md:flex md:items-center md:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <UserDropdown user={user} />
            ) : (
              <button
                className="bg-white/5 hover:bg-white/15 px-4 py-1 rounded-lg transition-all cursor-pointer"
                onClick={() => signIn(resolveOAuth())}
              >
                Login
              </button>
            )}
          </div>

          <button
            type="button"
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-border/50"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="pt-3 border-t border-border/50">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-sm font-medium">{user.name}</p>
                            {user.role !== "guest" && (
                              <Image
                                src={`/roles/${user.role}.svg`}
                                alt={user.role}
                                height={14}
                                width={14}
                              />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={handleRefresh}
                          className="flex items-center gap-2 text-sm text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <RefreshCcw className="w-3.5 h-3.5" />
                          Refresh Roles
                        </button>
                        <button
                          onClick={() =>
                            authClient
                              .signOut()
                              .then(() => window.location.reload())
                          }
                          className="flex items-center gap-2 text-sm text-red-400 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => signIn(resolveOAuth())}
                      className="w-full bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
