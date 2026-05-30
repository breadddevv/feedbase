"use client";
import { useState, useEffect } from "react";
import { CopyButton } from "../copyBtn";
import { IoLogoJavascript } from "react-icons/io5";
import { FaReact, FaHtml5, FaPython, FaRust  } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { BiLogoTypescript } from "react-icons/bi";
import { IoLogoCss3 } from "react-icons/io";
import { FaPhp } from "react-icons/fa";

const LANG_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  js:         IoLogoJavascript,
  javascript: IoLogoJavascript,
  jsx:        FaReact,
  ts:         BiLogoTypescript,
  tsx:        FaReact,
  css:        IoLogoCss3,
  html:       FaHtml5,
  python:     FaPython,
  py:         FaPython,
  rust:       FaRust,
  rs:         FaRust,
  go:         FaGolang,
  php:        FaPhp,
};

const LANG_NAMES: Record<string, string> = {
  js: "JavaScript",
  jsx: "JavaScript (JSX)",
  ts: "TypeScript",
  tsx: "TypeScript (TSX)",
  css: "CSS",
  html: "HTML",
  py: "Python",
  rs: "Rust",
  go: "Go",
  php: "PHP",
};

export function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    import("shiki")
      .then(({ codeToHtml }) =>
        codeToHtml(code, {
          lang: lang || "text",
          theme: "aurora-x",
          transformers: [
            {
              pre(node) {
                node.properties.style = node.properties.style
                  ?.toString()
                  .replace(
                    /background-color:[^;]+;?/,
                    "background-color: transparent;",
                  );
              },
            },
          ],
        }),
      )
      .then(setHtml);
  }, [code, lang]);

  const LangIcon = LANG_ICONS[lang?.toLowerCase()];

  return (
    <div className="my-4 group relative rounded-xl overflow-hidden border border-zinc-200/20">
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex items-center">
          <div className="flex"></div>
          {LangIcon && <LangIcon size={18} className="text-white mx-1" />}
          {lang && (
            <span className="text-xs font-medium text-white tracking-wider">
              {LANG_NAMES[lang?.toLowerCase()] || lang}
            </span>
          )}
        </div>
        <CopyButton code={code} />
      </div>
      {html ? (
        <div
          className="[&>pre]:p-4 [&>pre]:overflow-x-auto [&>pre]:text-xs [&>pre]:leading-relaxed [&>pre]:m-0 [&>pre]:font-mono"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="p-4 overflow-x-auto text-xs leading-relaxed m-0 font-mono text-zinc-400">
          {code}
        </pre>
      )}
    </div>
  );
}
