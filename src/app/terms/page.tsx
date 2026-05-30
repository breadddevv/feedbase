"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, AlertTriangle, GitCommitHorizontal, Info, ScrollText, Shield, ShieldAlert } from "lucide-react";

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
    title: "Acceptance of terms",
    blocks: [
      { type: "text", content: "By deploying, installing, or using Feedbase, you agree to these terms. If you are using Feedbase on behalf of an organisation, you represent that you have the authority to bind that organisation to these terms." },
      { type: "warn", content: "If you do not agree with these terms, do not deploy or use the software." },
    ],
  },
  {
    title: "License",
    blocks: [
      { type: "text", content: "Feedbase is released under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of that license." },
      { type: "tip", content: "The full license text is available in the LICENSE file in the Feedbase repository." },
    ],
  },
  {
    title: "Self-hosted software",
    blocks: [
      { type: "text", content: "Feedbase is software you run on your own infrastructure. As the operator, you are solely responsible for:" },
      {
        type: "list",
        items: [
          "Deploying and maintaining your instance securely.",
          "Ensuring your use complies with applicable laws and regulations.",
          "The data stored on your instance and how it is handled.",
          "Keeping your instance up to date with security releases.",
        ],
      },
      { type: "note", content: "Feedbase maintainers have no access to your instance or its data at any time." },
    ],
  },
  {
    title: "Acceptable use",
    changed: true,
    blocks: [
      { type: "text", content: "You may not use Feedbase to:" },
      {
        type: "list",
        items: [
          "Collect or process data in violation of applicable privacy laws.",
          "Facilitate illegal activities or store unlawful content.",
          "Violate the rights of any third party, including intellectual property rights.",
          "Attempt to reverse-engineer third-party integrations in violation of their terms.",
          "Distribute malware, spam, or otherwise harmful content through your instance.",
        ],
      },
      { type: "warn", content: "You are solely responsible for ensuring your use of Feedbase complies with all applicable laws in your jurisdiction." },
    ],
  },
  {
    title: "User-generated content",
    blocks: [
      { type: "text", content: "Feedbase provides a feedback platform where users can submit posts, comments, and other content." },
      { type: "note", content: "As the instance operator, you are responsible for moderating content submitted to your instance and ensuring it complies with applicable laws." },
      { type: "tip", content: "Feedbase maintainers have no responsibility for content submitted to self-hosted instances." },
    ],
  },
  {
    title: "Contributions",
    blocks: [
      { type: "text", content: "By submitting a pull request, issue, or other contribution to the Feedbase repository, you agree that your contribution may be incorporated into the project and distributed under the MIT License." },
      { type: "note", content: "You represent that you have the right to submit the contribution and that it does not infringe any third-party intellectual property rights." },
    ],
  },
  {
    title: "Third-party services",
    changed: true,
    blocks: [
      { type: "text", content: "Feedbase supports optional integrations with Discord, Slack, GitHub, and email providers. Your use of these services is governed by their respective terms of service and privacy policies." },
      { type: "warn", content: "Feedbase maintainers are not responsible for the availability, accuracy, conduct, or data handling of any third-party service." },
      { type: "tip", content: "Review each integration's privacy policy before enabling it, especially if your instance handles personal data subject to GDPR or similar regulations." },
    ],
  },
  {
    title: "Disclaimer of warranties",
    blocks: [
      { type: "text", content: 'Feedbase is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.' },
      { type: "danger", content: "In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from, out of, or in connection with the software or the use or other dealings in the software." },
    ],
  },
  {
    title: "Limitation of liability",
    blocks: [
      { type: "text", content: "To the fullest extent permitted by law, Feedbase maintainers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of revenue, or loss of business, arising out of your use or inability to use the software." },
      { type: "danger", content: "You assume full responsibility for any damages, data loss, or legal consequences arising from running a self-hosted instance of Feedbase." },
    ],
  },
  {
    title: "Security responsibilities",
    changed: true,
    blocks: [
      { type: "text", content: "Security patches and updates are published in the Feedbase GitHub repository. You are responsible for applying them in a timely manner." },
      { type: "warn", content: "Running an outdated version of Feedbase may expose your instance and your users' data to known vulnerabilities." },
      { type: "danger", content: "Never expose your .env file, database credentials, or admin panel to the public internet. Feedbase maintainers will never ask for these." },
    ],
  },
  {
    title: "Changes to these terms",
    blocks: [
      { type: "text", content: "We may update these terms from time to time. Material changes will be noted in the Feedbase changelog and repository." },
      { type: "note", content: "Continued use of the software after changes constitutes your acceptance of the updated terms." },
    ],
  },
  {
    title: "Contact",
    blocks: [
      { type: "text", content: "For questions about these terms, open an issue on the Feedbase GitHub repository or reach out on Discord." },
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

export default function TermsPage() {
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <ScrollText size={24} />
            </div>
          </div>
          <p className="text-sm font-medium uppercase tracking-widest text-primary mb-3">Legal</p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </motion.div>

        {/* Intro callout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-6 p-4 rounded-2xl border border-primary/20 bg-primary/5"
        >
          <p className="text-sm text-foreground/80 leading-relaxed">
            <span className="font-semibold text-foreground">Feedbase is MIT licensed open-source software.</span>{" "}
            These terms are intentionally plain and minimal. You own your instance, your data, and your deployment.
          </p>
        </motion.div>

        {/* Recent changes */}
        {sections.some(s => s.changed) && (
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
        )}

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
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Privacy policy
          </Link>
        </motion.div>
      </div>
    </section>
  );
}