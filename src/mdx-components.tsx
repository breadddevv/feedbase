import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl font-bold tracking-tight text-foreground mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-semibold text-foreground mt-8 mb-3 border-b border-border pb-2">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h3>
  ),
  h4: ({ children }) => (
    <h4 className="text-base font-semibold text-foreground mt-4 mb-1">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="text-sm text-muted-foreground leading-7 mb-4">{children}</p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all"
      target={"_blank"}
      rel={"noopener noreferrer"}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-6 space-y-1.5 list-disc marker:text-muted-foreground/50">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-6 space-y-1.5 list-decimal marker:text-muted-foreground/50">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-sm text-muted-foreground leading-7">{children}</li>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 border-l-2 border-primary/50 pl-4 text-sm italic text-muted-foreground">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-4 rounded-xl border border-border bg-muted p-4 overflow-x-auto text-xs font-mono leading-relaxed">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-6 border-border" />
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-muted border-b border-border">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-border">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="transition-colors hover:bg-muted/50">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2.5 text-sm text-muted-foreground">{children}</td>
  ),
  img: ({ src, alt }) => (
    <Image src={src} alt={alt} className="my-4 rounded-xl border border-border w-full object-cover" />
  ),
}

export function useMDXComponents(): MDXComponents {
  return components
}