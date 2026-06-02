import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, BookOpen, Terminal } from "lucide-react";
import { posts } from "@/content/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// A simple Markdown helper that parses text blocks into styled HTML elements safely
function parseMarkdown(content: string) {
  // Split content by code blocks
  const parts = content.split(/(```[\s\S]*?```)/g);

  return parts.map((part, index) => {
    // If it's a code block
    if (part.startsWith("```")) {
      const match = part.match(/```(\w*)\n([\s\S]*?)```/);
      const language = match ? match[1] : "txt";
      const code = match ? match[2].trim() : part.slice(3, -3).trim();

      return (
        <div key={index} className="my-6 border border-border-subtle/50 rounded-xl overflow-hidden bg-card-bg/40 font-mono text-xs">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle/30 bg-background/50 text-[10px] text-text-muted">
            <span className="flex items-center gap-1.5 font-semibold font-mono">
              <Terminal className="h-3 w-3 text-accent" />
              SYSTEM_CODE_CONSOLE // {language.toUpperCase()}
            </span>
            <span>UTF-8</span>
          </div>
          {/* Code */}
          <pre className="p-4 overflow-x-auto text-foreground/90 leading-relaxed scrollbar">
            <code>{code}</code>
          </pre>
        </div>
      );
    }

    // It's a text block, process headers, lists, and paragraphs line by line
    const lines = part.split("\n");
    return (
      <div key={index} className="space-y-4">
        {lines.map((line, lIdx) => {
          const trimmed = line.trim();

          if (!trimmed) return null;

          // Header 3
          if (trimmed.startsWith("### ")) {
            return (
              <h3 key={lIdx} className="font-heading text-lg md:text-xl font-bold tracking-tight text-foreground pt-4 mt-6 first:mt-0">
                {trimmed.replace("### ", "")}
              </h3>
            );
          }

          // Header 2
          if (trimmed.startsWith("## ")) {
            return (
              <h2 key={lIdx} className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground pt-6 mt-8 border-b border-border-subtle/35 pb-2">
                {trimmed.replace("## ", "")}
              </h2>
            );
          }

          // Bullet List
          if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
            const rawContent = trimmed.substring(2);
            // Replace bold tags in bullets
            const processed = parseInlineFormatting(rawContent);
            return (
              <ul key={lIdx} className="list-disc list-inside pl-4 text-sm text-text-muted leading-relaxed font-medium space-y-1.5">
                <li>{processed}</li>
              </ul>
            );
          }

          // Numbered list
          if (/^\d+\.\s/.test(trimmed)) {
            const rawContent = trimmed.replace(/^\d+\.\s/, "");
            const processed = parseInlineFormatting(rawContent);
            return (
              <ol key={lIdx} className="list-decimal list-inside pl-4 text-sm text-text-muted leading-relaxed font-medium space-y-1.5">
                <li>{processed}</li>
              </ol>
            );
          }

          // Standard paragraph
          return (
            <p key={lIdx} className="text-sm md:text-base text-text-muted leading-relaxed font-medium font-sans">
              {parseInlineFormatting(trimmed)}
            </p>
          );
        })}
      </div>
    );
  });
}

// Simple inline formatting parser for bold tags (**text**)
function parseInlineFormatting(text: string) {
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  return boldParts.map((bPart, idx) => {
    if (bPart.startsWith("**") && bPart.endsWith("**")) {
      return (
        <strong key={idx} className="text-foreground font-bold font-heading">
          {bPart.slice(2, -2)}
        </strong>
      );
    }
    return bPart;
  });
}

export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl w-full px-6 py-12 md:py-20 space-y-10">
      {/* Back button */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent font-semibold transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>BACK TO ARCHIVES</span>
      </Link>

      {/* Header Info */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        {/* Category & Stats */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-accent" />
            {post.date}
          </span>
          <span className="h-1 w-1 bg-border-subtle rounded-full" />
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readTime}
          </span>
          <span className="h-1 w-1 bg-border-subtle rounded-full" />
          <span className="text-accent font-bold tracking-wider">
            {post.category.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          {post.title}
        </h1>

        {/* Summary banner */}
        <p className="text-base text-text-muted italic border-l-2 border-accent/40 pl-4 py-1 mt-4 leading-relaxed font-sans font-medium">
          {post.summary}
        </p>
      </div>

      {/* Body content */}
      <div className="space-y-6 pt-4">
        {parseMarkdown(post.content)}
      </div>

      {/* Footer Info / Links */}
      <div className="border-t border-border-subtle/50 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          <span className="text-xs font-mono text-text-muted">
            CATEGORY // {post.category.toUpperCase()}
          </span>
        </div>
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-accent hover:text-white font-bold transition-colors group"
        >
          <span>EXPLORE ALL ENTRIES</span>
          <ArrowLeft className="h-3.5 w-3.5 rotate-180 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  );
}
