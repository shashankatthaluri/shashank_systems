"use client";

import { useState } from "react";
import { Terminal, BrainCircuit, Shuffle, LayoutTemplate, GitFork, Minimize2, Cpu } from "lucide-react";
import { systemsThinkingEssays } from "@/content/data";

export default function HowIThink() {
  const [activeIndex, setActiveIndex] = useState(0);

  const icons = [
    Minimize2,       // Reducing cognitive friction
    Shuffle,         // Systems over features
    Cpu,             // Workflow compression
    LayoutTemplate,  // Cognition-inspired UX
    GitFork,         // Learning dependency graphs
    BrainCircuit,    // AI-native interfaces
    Terminal,        // Operational simplicity
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
      {/* Selection Menu */}
      <div className="space-y-2 md:col-span-1">
        {systemsThinkingEssays.map((essay, idx) => {
          const Icon = icons[idx % icons.length];
          const isActive = idx === activeIndex;

          return (
            <button
              key={essay.title}
              onClick={() => setActiveIndex(idx)}
              className={`w-full flex items-center gap-3.5 px-4 py-4 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? "bg-accent/10 border-accent text-foreground shadow-[0_0_20px_rgba(224,106,59,0.05)]"
                  : "border-border-subtle/50 hover:border-accent/30 text-text-muted hover:text-foreground bg-card-bg/20"
              }`}
            >
              <div className={`p-2 rounded-lg border transition-colors ${isActive ? "bg-accent border-accent text-white" : "border-border-subtle bg-background"}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className={`text-xs font-mono font-bold tracking-wider ${isActive ? "text-accent" : "text-text-muted"}`}>
                  METHODOLOGY_0{idx + 1}
                </div>
                <div className="text-sm font-heading font-semibold mt-0.5">{essay.title}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Content Display Card */}
      <div className="md:col-span-2 glass rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle grid background for the card */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div>
            <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
              PHILOSOPHICAL PRIMITIVE // 0{activeIndex + 1}
            </span>
            <h3 className="font-heading font-bold text-2xl mt-1 text-foreground">
              {systemsThinkingEssays[activeIndex].title}
            </h3>
            <p className="text-base text-text-muted font-medium mt-2">
              {systemsThinkingEssays[activeIndex].summary}
            </p>
          </div>

          <div className="border-t border-border-subtle/50 pt-6">
            <h4 className="font-mono text-xs font-semibold tracking-wider text-foreground uppercase mb-2">
              Thesis & Systems Impact
            </h4>
            <p className="text-sm text-text-muted leading-relaxed font-sans">
              {systemsThinkingEssays[activeIndex].description}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-border-subtle/30 pt-6 mt-8 text-[10px] font-mono text-text-muted/65">
          <span>COGNITIVE CORE VER_2.6</span>
          <span>REDUCING COGNITIVE FRICTION IS THE ULTIMATE METRIC</span>
        </div>
      </div>
    </div>
  );
}
