"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderGit2, BookOpen, Terminal, Sparkles, X } from "lucide-react";
import { projects, posts, systemNodes } from "@/content/data";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when palette opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Fuzzy scoring helper
  const getFuzzyScore = (text: string, queryStr: string): number => {
    if (!queryStr) return 0;
    const lowerText = text.toLowerCase();
    const lowerQuery = queryStr.toLowerCase();

    if (lowerText === lowerQuery) return 100;
    if (lowerText.startsWith(lowerQuery)) return 80;
    if (lowerText.includes(lowerQuery)) return 50;

    let score = 0;
    let queryIdx = 0;
    for (let i = 0; i < lowerText.length; i++) {
      if (lowerText[i] === lowerQuery[queryIdx]) {
        score += 5; // Match character
        if (i > 0 && lowerText[i - 1] === lowerQuery[queryIdx - 1]) {
          score += 10; // Consecutive characters bonus
        }
        queryIdx++;
        if (queryIdx === lowerQuery.length) {
          return score;
        }
      }
    }
    return score;
  };

  // Compile all searchable items
  const allSearchableItems = useMemo(() => {
    return [
      // Navigation commands
      { label: "/work", desc: "Go to Work & Shipped Projects", path: "/work", icon: FolderGit2, category: "Commands & Navigation", tags: ["/work", "projects", "portfolio", "code", "ship"] },
      { label: "/philosophy", desc: "Go to Core Principles & System Beliefs", path: "/philosophy", icon: Sparkles, category: "Commands & Navigation", tags: ["/philosophy", "principles", "beliefs", "worldview", "rules"] },
      { label: "/systems", desc: "Go to Systems Thinking & Philosophy", path: "/systems", icon: Terminal, category: "Commands & Navigation", tags: ["/systems", "essays", "thinking", "rules"] },
      { label: "/writing", desc: "Go to Build Logs & Articles Archive", path: "/writing", icon: BookOpen, category: "Commands & Navigation", tags: ["/writing", "blog", "logs", "failures", "diary"] },
      { label: "/about", desc: "Go to Operating Philosophy & Bio", path: "/about", icon: Sparkles, category: "Commands & Navigation", tags: ["/about", "philosophy", "bio", "interests", "beliefs", "mind"] },
      { label: "/now", desc: "Go to Active Focus & System Monitor Status", path: "/now", icon: Terminal, category: "Commands & Navigation", tags: ["/now", "status", "active", "debugging", "obsessions"] },

      // Projects
      ...projects.map((p) => ({
        label: p.title,
        desc: p.tagline,
        path: `/work/${p.slug}`,
        icon: FolderGit2,
        category: "Projects & Productions",
        tags: [p.title, p.tagline, p.problem, p.insight, ...p.techStack]
      })),

      // Posts
      ...posts.map((post) => ({
        label: post.title,
        desc: post.summary,
        path: `/writing/${post.slug}`,
        icon: BookOpen,
        category: "Build Logs & Essays",
        tags: [post.title, post.summary, post.category]
      })),

      // System Map Nodes
      ...systemNodes.map((node) => ({
        label: node.label,
        desc: node.description,
        path: `/#node-${node.id}`,
        icon: Terminal,
        category: "System Architecture Nodes",
        tags: [node.label, node.description, node.category, ...(node.linkedConcepts || []), ...(node.experiments || []), ...(node.decisions || [])]
      }))
    ];
  }, []);

  // Filter and rank items
  const allItems = useMemo(() => {
    if (!query) {
      return allSearchableItems;
    }

    return allSearchableItems
      .map((item) => {
        let maxScore = 0;
        // Priority to commands matching slash prefix
        if (item.category === "Commands & Navigation" && query.startsWith("/")) {
          maxScore = Math.max(maxScore, getFuzzyScore(item.label, query) * 2.0);
        } else {
          maxScore = Math.max(maxScore, getFuzzyScore(item.label, query) * 1.5);
        }

        if (item.desc) {
          maxScore = Math.max(maxScore, getFuzzyScore(item.desc, query) * 0.8);
        }

        item.tags.forEach((tag) => {
          maxScore = Math.max(maxScore, getFuzzyScore(tag, query));
        });

        return { ...item, score: maxScore };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, allSearchableItems]);

  // Reset selection index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keydown navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex].path);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allItems]);

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  if (!isOpen) return null;

  // Extract unique categories in order of appearance in filtered list
  const categories = Array.from(new Set(allItems.map((item) => item.category)));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border-subtle bg-card-bg/95 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Input area */}
        <div className="flex items-center border-b border-border-subtle px-4 py-3">
          <Search className="h-5 w-5 text-text-muted mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-foreground placeholder-text-muted focus:outline-none text-base font-sans"
            placeholder="Search concepts or navigate (e.g. /now, /about, sync, docker)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-border-subtle/50 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results area */}
        <div className="max-h-[350px] overflow-y-auto p-2 scrollbar">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-text-muted font-sans">
              No results found for &ldquo;<span className="text-foreground">{query}</span>&rdquo;
            </div>
          ) : (
            <div className="space-y-4">
              {/* Group items by category */}
              {categories.map((category) => {
                const categoryItems = allItems.filter((item) => item.category === category);
                return (
                  <div key={category} className="space-y-1">
                    <div className="px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider text-accent uppercase opacity-85 border-b border-border-subtle/25">
                      {category}
                    </div>
                    <div className="space-y-0.5">
                      {categoryItems.map((item) => {
                        const globalIndex = allItems.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <div
                            key={item.path}
                            onClick={() => handleSelect(item.path)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                              isSelected
                                ? "bg-accent/10 border-l-2 border-accent pl-4"
                                : "hover:bg-border-subtle/20 border-l-2 border-transparent"
                            }`}
                          >
                            <Icon className={`h-4.5 w-4.5 mr-3 shrink-0 ${isSelected ? "text-accent" : "text-text-muted"}`} />
                            
                            <div className="flex flex-col flex-1 min-w-0 pr-4">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold truncate ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
                                  {item.label}
                                </span>
                                <span className="text-[8px] font-mono px-1 py-0.2 rounded border border-border-subtle/50 bg-background text-text-muted shrink-0 font-bold">
                                  {item.category === "Commands & Navigation" && "CMD"}
                                  {item.category === "Projects & Productions" && "PRJ"}
                                  {item.category === "Build Logs & Essays" && "LOG"}
                                  {item.category === "System Architecture Nodes" && "NODE"}
                                </span>
                              </div>
                              <span className="text-[10px] text-text-muted truncate mt-0.5 font-sans leading-tight">
                                {item.desc}
                              </span>
                            </div>

                            {isSelected && (
                              <span className="text-[10px] font-mono text-accent opacity-80 animate-pulse shrink-0">
                                ENTER
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border-subtle bg-background/50 px-4 py-2.5 text-[10px] font-mono text-text-muted">
          <div className="flex gap-4">
            <span>
              <kbd className="bg-border-subtle px-1.5 py-0.5 rounded text-[9px] mr-1">↑↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="bg-border-subtle px-1.5 py-0.5 rounded text-[9px] mr-1">Enter</kbd>
              Select
            </span>
          </div>
          <div>
            <span>
              <kbd className="bg-border-subtle px-1.5 py-0.5 rounded text-[9px] mr-1">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
