"use client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { TbBrandGithubFilled } from "react-icons/tb";
import { FaDiscord } from "react-icons/fa";
import Image from "next/image";

const footerLinks = {
  product: [
    { name: "Features", href: "https://boostify.breaddevv.cc/features" },
    { name: "Pricing", href: "https://boostify.breaddevv.cc/pricing" },
  ],
  developers: [
    { name: "Documentation", href: "https://docs.boostify.breaddevv.cc" },
    {
      name: "GitHub",
      href: "https://github.com/breadddevv/feedbase",
      external: true,
    },
    {
      name: "Contributing",
      href: "https://github.com/breadddevv/feedbase/blob/main/CONTRIBUTING.md",
      external: true,
    },
    {
      name: "Changelog",
      href: "https://github.com/breadddevv/feedbase/releases",
      external: true,
    },
  ],
  community: [
    { name: "Discord", href: "https://boostify.breaddevv.cc/discord" },
    { name: "X (formerly Twitter)", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Support", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "https://boostify.breaddevv.cc/privacy" },
    { name: "Terms", href: "https://boostify.breaddevv.cc/terms" },
    {
      name: "License (MIT)",
      href: "https://github.com/teamboostify/boostify/blob/main/LICENSE",
      external: true,
    },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image
                width={36}
                height={6}
                src="/logo.png"
                alt="B"
              />
              <span className="text-lg font-bold text-foreground">
                Feedbase
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Open source feedback management platform for product teams.
            </p>
            <Link
              href="https://github.com/breadddevv/feedbase"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <TbBrandGithubFilled className="h-4 w-4" />
              Star on GitHub
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Product</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Developers
            </h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.developers.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Community</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 Feedbase. MIT Licensed.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Discord</span>
              <FaDiscord className="h-5 w-5" />
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="https://github.com/breadddevv/feedbase"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <TbBrandGithubFilled className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
