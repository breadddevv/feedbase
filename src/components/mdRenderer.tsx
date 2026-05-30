"use client";
import Markdown from "react-markdown";
import { useMDXComponents } from "@/mdx-components";
import type { Components } from "react-markdown";

export function MarkdownRenderer({ content }: { content: string }) {
  const components = useMDXComponents();
  return (
    <Markdown components={components as Components}>
      {content}
    </Markdown>
  );
}