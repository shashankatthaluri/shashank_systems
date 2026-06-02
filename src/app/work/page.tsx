"use client";

import { useState } from "react";
import Link from "next/link";
import { FolderGit2, ArrowRight, Layers, Cpu, ArrowUpRight } from "lucide-react";
import { projects } from "@/content/data";

export default function WorkPage() {
  const [filter, setFilter] = useState("all");

  const categories = [
    { id: "all", label: "ALL SYSTEMS" },
    { id: "ai", label: "AI & COGNITION" },
    { id: "offline", label: "OFFLINE & EVENT-DRIVEN" },
    { id: "tooling", label: "DEVELOPER TOOLING" },
  ];

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "ai") return project.slug === "cognition-rl" || project.slug === "dependency-mapping" || project.slug === "selected-workflows";
    if (filter === "offline") return project.slug === "menuos" || project.slug === "selected-workflows";
    if (filter === "tooling") return project.slug === "shipclawfast" || project.slug === "dependency-mapping";
    return true;
  });

  return (
    <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <FolderGit2 className="h-3 w-3" />
          <span>PORTFOLIO_SYSTEMS_INDEX</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Engineering Showcase
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          Detailed project breakdowns of shipped software. Every case study outlines the technical decisions, architecture diagrams, and lessons learned from the building process.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border-subtle/50 pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold tracking-wider transition-all border ${
              filter === cat.id
                ? "border-accent bg-accent/10 text-accent"
                : "border-border-subtle/50 text-text-muted hover:text-foreground hover:border-accent/20 bg-card-bg/25"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Architectures */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {filteredProjects.map((project, idx) => (
          <div
            key={project.slug}
            className="glass hover:border-accent/40 hover:shadow-[0_0_30px_rgba(224,106,59,0.03)] rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 relative group"
          >
            <div className="absolute top-6 right-6 flex items-center justify-center h-8 w-8 rounded-lg border border-border-subtle bg-background/50 text-text-muted group-hover:text-accent group-hover:border-accent/30 transition-all">
              <ArrowUpRight className="h-4.5 w-4.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <div>
              {/* Index indicator */}
              <div className="font-mono text-[10px] text-accent font-semibold tracking-wider">
                NODE_0{idx + 1} // {project.slug.toUpperCase()}
              </div>

              {/* Title & Tag */}
              <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground mt-2 group-hover:text-accent transition-colors">
                {project.title}
              </h2>
              <p className="text-sm text-text-muted font-medium mt-1 leading-relaxed">
                {project.tagline}
              </p>

              {/* Tech Stack List */}
              <div className="flex flex-wrap gap-1.5 mt-4">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-border-subtle bg-background text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Problem/Insight Summary */}
              <div className="mt-6 border-t border-border-subtle/30 pt-6 space-y-4">
                <div>
                  <h4 className="font-mono text-[9px] text-foreground/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-accent/80" />
                    THE CHALLENGE
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-3">
                    {project.problem}
                  </p>
                </div>
                <div>
                  <h4 className="font-mono text-[9px] text-foreground/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-accent/80" />
                    KEY ARCHITECTURE
                  </h4>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed line-clamp-3">
                    {project.architecture}
                  </p>
                </div>
              </div>
            </div>

            {/* Read System Breakdown link */}
            <div className="mt-8 pt-4 border-t border-border-subtle/30">
              <Link
                href={`/work/${project.slug}`}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-accent group-hover:text-white transition-colors"
              >
                <span>OPEN BLUEPRINT</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
