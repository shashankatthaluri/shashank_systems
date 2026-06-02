"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Network, BookOpen, FolderGit2, X, Info } from "lucide-react";
import { systemNodes, projects, posts, SystemNode } from "@/content/data";

export default function SystemMap() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      if (hash && hash.startsWith("#node-")) {
        const nodeId = hash.replace("#node-", "");
        const node = systemNodes.find((n) => n.id === nodeId);
        if (node) {
          setSelectedNodeId(nodeId);
          setTimeout(() => {
            const el = document.getElementById("system-map-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const selectedNode = useMemo(() => {
    return systemNodes.find((n) => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Compute related items dynamically based on node associations
  const relatedItems = useMemo(() => {
    if (!selectedNodeId) return { projects: [], posts: [] };

    // Define direct semantic mappings
    const mappings: Record<string, { projects: string[]; posts: string[] }> = {
      "ai-systems": {
        projects: ["cognition-rl", "selected-workflows"],
        posts: ["problem-with-shared-agent-state"],
      },
      cognition: {
        projects: ["dependency-mapping"],
        posts: ["why-we-removed-docker-entirely", "why-operational-ux-matters-more-than-beautiful-ui"],
      },
      rl: {
        projects: ["cognition-rl"],
        posts: ["problem-with-shared-agent-state"],
      },
      "workflow-design": {
        projects: ["selected-workflows", "shipclawfast"],
        posts: ["why-we-removed-docker-entirely", "what-clock-drift-taught-me-about-restaurant-systems"],
      },
      "product-systems": {
        projects: ["shipclawfast", "menuos"],
        posts: ["why-most-sync-engines-eventually-lie", "why-we-removed-docker-entirely"],
      },
      ux: {
        projects: ["menuos", "dependency-mapping"],
        posts: ["why-most-sync-engines-eventually-lie", "why-operational-ux-matters-more-than-beautiful-ui"],
      },
      infrastructure: {
        projects: ["menuos", "shipclawfast"],
        posts: ["why-most-sync-engines-eventually-lie"],
      },
      "human-behavior": {
        projects: ["dependency-mapping"],
        posts: ["why-operational-ux-matters-more-than-beautiful-ui"],
      },
      "learning-systems": {
        projects: ["dependency-mapping"],
        posts: ["why-we-removed-docker-entirely"],
      },
      "operational-tooling": {
        projects: ["shipclawfast"],
        posts: ["why-we-removed-docker-entirely"],
      },
    };

    const map = mappings[selectedNodeId] || { projects: [], posts: [] };
    
    return {
      projects: projects.filter((p) => map.projects.includes(p.slug)),
      posts: posts.filter((post) => map.posts.includes(post.slug)),
    };
  }, [selectedNodeId]);

  // Draw paths for node connections
  const edges = useMemo(() => {
    const list: { key: string; x1: number; y1: number; x2: number; y2: number; from: string; to: string }[] = [];
    const seen = new Set<string>();

    systemNodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = systemNodes.find((n) => n.id === targetId);
        if (target) {
          const edgeKey = [node.id, target.id].sort().join("-");
          if (!seen.has(edgeKey)) {
            seen.add(edgeKey);
            list.push({
              key: edgeKey,
              x1: node.x,
              y1: node.y,
              x2: target.x,
              y2: target.y,
              from: node.id,
              to: target.id,
            });
          }
        }
      });
    });
    return list;
  }, []);

  const handleNodeClick = (id: string) => {
    setSelectedNodeId(id === selectedNodeId ? null : id);
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    if (hoveredNodeId) {
      return from === hoveredNodeId || to === hoveredNodeId;
    }
    if (selectedNodeId) {
      return from === selectedNodeId || to === selectedNodeId;
    }
    return false;
  };

  const isNodeConnected = (nodeId: string) => {
    const activeNodeId = hoveredNodeId || selectedNodeId;
    if (!activeNodeId) return true; // Show all normal if no hover/select
    if (nodeId === activeNodeId) return true;
    
    const activeNode = systemNodes.find(n => n.id === activeNodeId);
    return activeNode?.connections.includes(nodeId) || false;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Interactive Map Visual */}
      <div className="lg:col-span-2 glass rounded-2xl p-4 md:p-6 overflow-hidden relative min-h-[450px] flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-border-subtle/50 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Network className="h-4.5 w-4.5 text-accent" />
            <h3 className="font-heading font-semibold text-sm tracking-wider uppercase">System Architecture Graph</h3>
          </div>
          <span className="text-[10px] font-mono text-text-muted">TAP NODES TO MAP COGNITION</span>
        </div>

        {/* Graph Container */}
        <div className="relative w-full h-[320px] md:h-[400px] select-none">
          <svg
            className="w-full h-full"
            viewBox="100 50 700 480"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Draw Edges */}
            {edges.map((edge) => {
              const highlighted = isEdgeHighlighted(edge.from, edge.to);
              return (
                <line
                  key={edge.key}
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  className="transition-all duration-300"
                  stroke={highlighted ? "var(--color-accent)" : "rgba(29, 39, 58, 0.4)"}
                  strokeWidth={highlighted ? 1.8 : 0.8}
                  strokeDasharray={highlighted ? "none" : "4 2"}
                  opacity={highlighted ? 0.9 : 0.4}
                />
              );
            })}

            {/* Draw Nodes */}
            {systemNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const connected = isNodeConnected(node.id);
              
              // Node Category Styling
              let color = "rgba(142, 155, 176, 0.6)"; // Default
              if (node.category === "core") color = "#8e9bb0";
              if (node.category === "foundation") color = "rgba(29, 39, 58, 0.8)";
              if (node.category === "application") color = "#64748b";
              if (isSelected || isHovered) color = "#e06a3b";

              return (
                <g
                  key={node.id}
                  className="cursor-pointer"
                  onClick={() => handleNodeClick(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Subtle Node pulse if selected/hovered */}
                  {(isSelected || isHovered) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={16}
                      fill="none"
                      stroke="#e06a3b"
                      strokeWidth={1}
                      className="animate-ping opacity-25"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? 8 : 6}
                    fill={color}
                    className="transition-all duration-300"
                    stroke={isSelected || isHovered ? "#fff" : "none"}
                    strokeWidth={1}
                    opacity={connected ? 1 : 0.25}
                  />

                  {/* Node Text Label */}
                  <text
                    x={node.x}
                    y={node.y - 12}
                    textAnchor="middle"
                    className={`font-mono text-[9px] font-semibold tracking-wider transition-all duration-300 select-none ${
                      isSelected || isHovered
                        ? "fill-accent font-bold"
                        : "fill-foreground/80"
                    }`}
                    opacity={connected ? 1 : 0.2}
                  >
                    {node.label.toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-[10px] font-mono text-text-muted border-t border-border-subtle/30 pt-3 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span>SELECTED / HOVERED</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#8e9bb0]" />
            <span>CORE SYSTEMS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#64748b]" />
            <span>APPLICATION LAYER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-border-subtle" />
            <span>FOUNDATIONS</span>
          </div>
        </div>
      </div>

      {/* Detail panel side panel HUD */}
      <div className="glass rounded-2xl p-4 md:p-5 min-h-[450px] flex flex-col justify-between">
        {!selectedNode ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="p-4 rounded-full bg-border-subtle/20 text-text-muted mb-4 border border-border-subtle/50">
              <Network className="h-6 w-6" />
            </div>
            <h4 className="font-heading font-semibold text-base mb-2">Cognitive Map HUD</h4>
            <p className="text-sm text-text-muted max-w-[240px] leading-relaxed">
              Click any node in the system graph to inspect structural insights, projects, and logs.
            </p>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between h-full">
            {/* Header info */}
            <div>
              <div className="flex items-start justify-between border-b border-border-subtle/60 pb-3 mb-3">
                <div>
                  <span className="text-[9px] font-mono text-accent uppercase tracking-wider">
                    SYSTEM NODE // {selectedNode.category}
                  </span>
                  <h4 className="font-heading font-bold text-base text-foreground mt-0.5">
                    {selectedNode.label}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-md text-text-muted hover:text-foreground hover:bg-border-subtle/50 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
 
              {/* Description */}
              <div className="text-xs text-text-muted leading-relaxed mb-4">
                {selectedNode.description}
              </div>

              {/* Concepts & Protocols */}
              {selectedNode.linkedConcepts && selectedNode.linkedConcepts.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-mono text-[9px] text-foreground font-bold tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <span className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                    CONCEPTS & PROTOCOLS
                  </h5>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.linkedConcepts.map((concept) => (
                      <code key={concept} className="px-1.5 py-0.5 rounded text-[9px] font-mono border border-border-subtle/60 bg-card-bg/60 text-foreground/90">
                        {concept}
                      </code>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Experiments */}
              {selectedNode.experiments && selectedNode.experiments.length > 0 && (
                <div className="mb-4 border-t border-border-subtle/30 pt-3">
                  <h5 className="font-mono text-[9px] text-foreground font-bold tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-[#ffc67a] rounded-full animate-ping shrink-0" />
                    ACTIVE EXPERIMENTS
                  </h5>
                  <ul className="space-y-1 pl-1">
                    {selectedNode.experiments.map((exp) => (
                      <li key={exp} className="text-[10px] font-mono text-text-muted flex items-start gap-1">
                        <span className="text-[#ffc67a] font-bold">&gt;</span>
                        <span>{exp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Architecture Decisions */}
              {selectedNode.decisions && selectedNode.decisions.length > 0 && (
                <div className="mb-4 border-t border-border-subtle/30 pt-3">
                  <h5 className="font-mono text-[9px] text-foreground/80 font-bold tracking-wider mb-2 uppercase flex items-center gap-1.5">
                    <span className="h-1 w-1 bg-accent rounded-full" />
                    ARCHITECTURE DECISION
                  </h5>
                  <div className="p-2.5 rounded-lg border border-border-subtle/50 bg-[#1e1c19]/35 text-text-muted">
                    <ul className="space-y-1">
                      {selectedNode.decisions.map((dec) => (
                        <li key={dec} className="text-[10px] font-mono leading-normal flex items-start gap-1.5">
                          <span className="text-accent font-bold mt-0.5">※</span>
                          <span>{dec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
 
              {/* Related Projects */}
              {relatedItems.projects.length > 0 && (
                <div className="mb-4 border-t border-border-subtle/30 pt-3">
                  <h5 className="font-mono text-[9px] text-foreground font-semibold tracking-wider mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="h-3.5 w-3.5 text-accent" />
                    RELATED PRODUCTS
                  </h5>
                  <div className="space-y-1.5">
                    {relatedItems.projects.map((project) => (
                      <Link
                        key={project.slug}
                        href={`/work/${project.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg border border-border-subtle/40 bg-border-subtle/5 hover:border-accent/40 hover:bg-accent/5 transition-all group"
                      >
                        <div className="truncate pr-4">
                          <div className="text-[11px] font-semibold text-foreground truncate">{project.title}</div>
                          <div className="text-[9px] text-text-muted truncate">{project.tagline}</div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
 
              {/* Related Writings */}
              {relatedItems.posts.length > 0 && (
                <div className="mb-4 border-t border-border-subtle/30 pt-3">
                  <h5 className="font-mono text-[9px] text-foreground font-semibold tracking-wider mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-accent" />
                    BUILD LOGS & ESSAYS
                  </h5>
                  <div className="space-y-1.5">
                    {relatedItems.posts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/writing/${post.slug}`}
                        className="flex items-center justify-between p-2 rounded-lg border border-border-subtle/40 bg-border-subtle/5 hover:border-accent/40 hover:bg-accent/5 transition-all group"
                      >
                        <div className="truncate pr-4">
                          <div className="text-[11px] font-semibold text-foreground truncate">{post.title}</div>
                          <div className="text-[9px] text-text-muted truncate">{post.summary}</div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
 
            {/* Bottom HUD metadata */}
            <div className="flex items-center gap-2 border-t border-border-subtle/50 pt-3 mt-4 text-[9px] font-mono text-text-muted">
              <Info className="h-3 w-3 text-accent shrink-0" />
              <span className="truncate">CONNECTED TO: {selectedNode.connections.map(c => c.toUpperCase()).join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
