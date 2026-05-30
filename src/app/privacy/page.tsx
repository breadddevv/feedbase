"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, GitCommitHorizontal, Info, Shield, ShieldAlert } from "lucide-react";

const LAST_UPDATED = new Date(2026, 4, 30).toLocaleDateString("en-GB", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

type Block =
  | { type: "text"; content: string }
  | { type: "list"; items: string[] }
  | { type: "note"; content: string }
  | { type: "warn"; content: string }
  | { type: "danger"; content: string }
  | { type: "tip"; content: string };

interface Section {
  title: string;
  blocks: Block[];
  changed?: boolean;
}

const sections: Section[] = [
  {
    title: "Overview",
    blocks: [
      { type: "text", content: "Feedbase is open-source, self-hosted feedback management software. Because you run it on your own infrastructure, you are the data controller — we have no access to anything stored on your instance." },
      { type: "text", content: "This policy describes what data Feedbase processes locally, and how it is handled." },
    ],
  },
  {
    title: "Data you control",
    blocks: [
      { type: "text", content: "All data on your Feedbase instance — user accounts, feedback posts, votes, comments, and attachments — lives in your own database on your own servers." },
      { type: "note", content: "Feedbase maintainers have zero access to this data. You decide how it is stored, backed up, and deleted." },
    ],
  },
  {
    title: "Data Feedbase may process",
    blocks: [
      { type: "text", content: "Feedbase processes the following data locally on your instance:" },
      {
        type: "list",
        items: [
          "Account information — name, email address, and hashed password provided during registration.",
          "Feedback content — posts, comments, votes, and reactions submitted by your users.",
          "Usage data — timestamps, IP addresses for rate limiting, and session tokens.",
          "Integration config — if you configure Discord, Slack, GitHub, or email integrations, tokens and settings are stored in your database.",
        ],
      },
      { type: "tip", content: "None of this data is transmitted to Feedbase maintainers or any third party by default." },
    ],
  },
  {
    title: "Telemetry & update checks",
    blocks: [
      { type: "text", content: "Feedbase may make outbound requests to the GitHub public API to check for software updates. These requests include only your current version number — no personally identifiable information is sent." },
      { type: "note", content: "All telemetry is opt-in only. No usage analytics, crash reports, or behavioural data is collected unless you explicitly enable it in your instance config." },
    ],
  },
  {
    title: "Third-party integrations",
    changed: true,
    blocks: [
      { type: "text", content: "Feedbase supports optional integrations with Discord, Slack, GitHub, and email providers. When configured, data may flow to those services under their own privacy policies." },
      { type: "warn", content: "You are responsible for ensuring your use of third-party integrations complies with applicable laws and those services' terms." },
    ],
  },
  {
    title: "Cookies & sessions",
    blocks: [
      { type: "text", content: "Feedbase uses session cookies strictly to keep users authenticated. These are necessary for the application to function and are not used for tracking or advertising." },
      { type: "tip", content: "No third-party analytics or advertising cookies are set by Feedbase." },
    ],
  },
  {
    title: "Your rights (GDPR & others)",
    blocks: [
      { type: "text", content: "As the instance operator, you have full control over all user data — you can view, export, or delete it directly from your database at any time." },
      { type: "text", content: "If you are a user of someone else's Feedbase instance, please contact that operator regarding your data rights." },
      { type: "note", content: "For users in the European Union, rights including access, rectification, erasure, and portability apply in accordance with GDPR." },
    ],
  },
  {
    title: "Data retention & deletion",
    blocks: [
      { type: "text", content: "Data is retained for as long as your instance is running and you choose to keep it. There are no external retention schedules imposed by Feedbase." },
      { type: "tip", content: "You may delete any user data at any time via the admin panel or directly from your database." },
    ],
  },
  {
    title: "Security",
    changed: true,
    blocks: [
      { type: "text", content: "We take reasonable technical measures to protect the software from known vulnerabilities. Security releases are published on the GitHub repository." },
      { type: "warn", content: "You are responsible for keeping your instance up to date. Running outdated versions may expose your instance to known vulnerabilities." },
      { type: "danger", content: "Never expose your database, environment variables, or admin credentials publicly. Feedbase maintainers will never ask for these." },
    ],
  },
  {
    title: "Changes to this policy",
    blocks: [
      { type: "text", content: "We may update this policy from time to time. Changes will be reflected in the Feedbase repository and noted in the changelog." },
      { type: "note", content: "Continued use of the software after changes constitutes acceptance of the updated policy." },
    ],
  },
  {
    title: "Contact",
    blocks: [
      { type: "text", content: "For questions about this privacy policy, open an issue on the Feedbase GitHub repository or reach out on Discord." },
    ],
  },
];

const blockStyles = {
  note: {
    wrapper: "bg-blue-500/8 border border-blue-500/20 rounded-xl p-3.5 flex gap-3",
    icon: <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />,
    label: "text-blue-400",
    text: "text-blue-300/80",
    labelText: "Note",
  },
  warn: {
    wrapper: "bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5 flex gap-3",
    icon: <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />,
    label: "text-amber-400",
    text: "text-amber-300/80",
    labelText: "Warning",
  },
  danger: {
    wrapper: "bg-red-500/8 border border-red-500/20 rounded-xl p-3.5 flex gap-3",
    icon: <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />,
    label: "text-red-400",
    text: "text-red-300/80",
    labelText: "Danger",
  },
  tip: {
    wrapper: "bg-primary/8 border border-primary/20 rounded-xl p-3.5 flex gap-3",
    icon: <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />,
    label: "text-primary",
    text: "text-primary/80",
    labelText: "Tip",
  },
};

function RenderBlock({ block }: { block: Block }) {
  if (block.type === "text") {
    return (
      <p className="text-sm text-muted-foreground leading-relaxed">{block.content}</p>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="flex flex-col gap-2">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
            <span className="mt-2 w-1 h-1 rounded-full bg-muted-foreground/40 shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  const style = blockStyles[block.type];
  return (
    <div className={style.wrapper}>
      {style.icon}
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${style.label}`}>
          {style.labelText}
        </p>
        <p className={`text-sm leading-relaxed ${style.text}`}>{block.content}</p>
      </div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <section className="relative py-24">
      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-8">

        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-150" />
            Back
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Shield size={24} />
            </div>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </motion.div>

        {/* Callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 p-4 rounded-2xl border border-primary/20 bg-primary/5"
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            <span className="font-semibold text-foreground">Feedbase is self-hosted.</span>{" "}
            You run it on your own infrastructure — which means you own all your data. We don&apos;t have servers that store your users&apos; information.
          </p>
        </motion.div>

        {/* Recent changes - should be done by checking the file is the same as this one */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-10 p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5"
        >
          <div className="flex items-center gap-2 mb-2">
            <GitCommitHorizontal className="w-4 h-4 text-amber-400" />
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-400">Recent changes</p>
          </div>
          <p className="text-sm text-amber-300/80 leading-relaxed mb-2">
            The following sections were updated on {LAST_UPDATED}:
          </p>
          <ul className="flex flex-col gap-1">
            {sections.filter(s => s.changed).map(s => (
              <li key={s.title} className="flex items-center gap-2 text-sm text-amber-300/70">
                <span className="w-1 h-1 rounded-full bg-amber-400/50 shrink-0" />
                {s.title}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-semibold text-foreground">
                  {section.title}
                </h2>
                {section.changed && (
                  <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-400">
                    <GitCommitHorizontal className="w-3 h-3" />
                    Updated
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {section.blocks.map((block, j) => (
                  <RenderBlock key={j} block={block} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-12 pt-8 border-t border-border flex items-center justify-between"
        >
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Feedbase. MIT licensed.</p>
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of service →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}