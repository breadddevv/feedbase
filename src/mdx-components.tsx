import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { CodeBlock } from "./components/markdown/codeBlock";
import { SafeImage } from "./components/markdown/image";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-white mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-semibold text-white mt-7 mb-3 pb-2 border-b border-zinc-800">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-base font-semibold text-zinc-100 mt-5 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-sm text-zinc-400 leading-7 mb-3">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary transition-all"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-100">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-zinc-400">{children}</em>,
  del: ({ children }) => (
    <del className="line-through text-zinc-600 decoration-zinc-500">
      {children}
    </del>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-5 space-y-1.5 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-5 space-y-1.5 list-decimal marker:text-zinc-600">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-zinc-400 leading-7 flex items-start gap-2">
      <span className="mt-2.5 w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
      <span>{children}</span>
    </li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 pl-4 border-l-2 border-primary/50">
      <div className="text-sm italic text-zinc-500 leading-7">{children}</div>
    </blockquote>
  ),

  code: ({ node, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    const lang = match?.[1] ?? "";
    const code = String(children).replace(/\n$/, "");

    if (!className) {
      return (
        <code className="bg-zinc-800 text-primary px-1.5 py-0.5 rounded-md text-xs font-mono border border-zinc-700">
          {children}
        </code>
      );
    }

    return <CodeBlock code={code} lang={lang} />;
  },
  pre: ({ children }) => <>{children}</>,

  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-zinc-800/60 border-b border-zinc-700">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-zinc-800">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-zinc-800/30">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-sm text-zinc-400">{children}</td>
  ),
  hr: () => <hr className="my-6 border-zinc-800" />,
  img: ({ src, alt }) => (
    <SafeImage src={src ?? ""} alt={alt ?? ""}/>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
