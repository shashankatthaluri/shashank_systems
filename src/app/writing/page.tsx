"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Search, Calendar, Clock, ArrowRight } from "lucide-react";
import { posts } from "@/content/data";

export default function WritingPage() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "ALL ARTICLES" },
    { id: "Build Log", label: "BUILD LOGS" },
    { id: "Product Decisions", label: "PRODUCT DECISIONS" },
    { id: "Failure Notes", label: "FAILURE NOTES" },
    { id: "Experiments", label: "EXPERIMENTS" },
    { id: "Observations", label: "OBSERVATIONS" },
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = filter === "all" || post.category === filter;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-4xl w-full px-6 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <BookOpen className="h-3 w-3" />
          <span>WRITING_ARCHITECTURE</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Build Logs & Essays
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          Chronicles of active builds, failures, product compromises, and observations on developer flow.
        </p>
        
        {/* Personal Intro Note */}
        <div className="p-4 rounded-xl border border-border-subtle/60 bg-card-bg/25 text-xs text-text-muted leading-relaxed font-sans font-medium max-w-3xl">
          <span className="font-mono text-accent font-bold uppercase tracking-wider block mb-1">BUILDER_PERSPECTIVE</span>
          &ldquo;I&rsquo;m increasingly convinced local-first UX will matter more than AI wrappers, and most dev tools fail because they optimize configurations over momentum. These logs are raw notes from the field—failures, compromises, and architecture lessons earned from shipping.&rdquo;
        </div>
      </div>

      {/* Search and Filter Panel */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-text-muted" />
          <input
            type="text"
            className="w-full bg-card-bg/35 border border-border-subtle hover:border-accent/30 focus:border-accent/60 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder-text-muted transition-all"
            placeholder="Search essays, build logs, and code diaries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Scroll Container */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold tracking-wider transition-all border ${
                filter === cat.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border-subtle/50 text-text-muted hover:text-foreground hover:border-accent/20 bg-card-bg/25"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chronological List of Entries */}
      <div className="space-y-8">
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-text-muted font-sans font-medium">
            No logs or essays found matching the criteria.
          </div>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="group relative flex flex-col items-start p-6 rounded-2xl border border-border-subtle/30 bg-card-bg/10 hover:border-accent/30 hover:bg-accent/2 transition-all duration-200"
            >
              {/* Top metadata row */}
              <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted mb-3">
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

              {/* Title & Summary */}
              <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors leading-snug">
                <Link href={`/writing/${post.slug}`} className="focus:outline-none">
                  {post.title}
                </Link>
              </h2>
              <p className="text-sm text-text-muted leading-relaxed font-sans font-medium mt-2 max-w-3xl">
                {post.summary}
              </p>

              {/* Bottom read link */}
              <div className="mt-4 pt-3 border-t border-border-subtle/30 w-full flex items-center justify-between">
                <Link
                  href={`/writing/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-accent group-hover:text-white transition-colors"
                >
                  <span>READ ARTICLE</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <span className="text-[9px] font-mono text-text-muted/50 uppercase tracking-widest hidden sm:inline">
                  SHA256 // {post.slug.substring(0, 8)}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
