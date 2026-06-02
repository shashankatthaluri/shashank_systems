import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Server, Code, ShieldAlert, BookOpen, Lightbulb, Workflow } from "lucide-react";
import { projects } from "@/content/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // A simple helper to render a customized SVG diagram based on the project slug
  const renderSystemDiagram = (slug: string) => {
    let diagramTitle = "SYSTEM TOPOLOGY DIAGRAM";
    let asciiArt = "";

    switch (slug) {
      case "shipclawfast":
        diagramTitle = "FLAGSHIP DIAGNOSTIC // CONTAINER CONTAINMENT & VM LIFECYCLE";
        asciiArt = `
[PROVISIONING / ISOLATION VM LIFECYCLE FLOW]

      [HTTP Request] ──> [Proxy Gateway] ──> (Auth & Billing Check)
                               │
                      [Valid Gateway Token]
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │  FLY.IO API & CONTAINER CONTAINMENT WORKER   │
        │                                              │
        │  1. Check VM cache state (Active/Suspended)  │
        │  2. If Idle: Boot micro-VM ($ flyctl scale)  │
        │  3. Attach persistent block volume (/data)   │
        └──────────────────────┬───────────────────────┘
                               │ (VM starts in < 450ms)
                               ▼
        ┌──────────────────────────────────────────────┐
        │        SANDBOXED CUSTOMER ENVIRONMENT        │
        │                                              │
        │  [V8 Runtime] ──> [Local SQLite DB]          │
        │       │ (Read/Write journals in memory)      │
        │       ▼                                      │
        │  [Agent Worker Core (isolated CPU limits)]   │
        └──────────────────────┬───────────────────────┘
                               │
                       (5 min idle timeout)
                               ▼
        ┌──────────────────────────────────────────────┐
        │          AUTOMATED SHUTDOWN VECTOR           │
        │                                              │
        │  1. Detect socket connection drops           │
        │  2. Trap SIGTERM & commit SQLite journal      │
        │  3. Shut down micro-VM (Scale back to zero)   │
        └──────────────────────────────────────────────┘`;
        break;

      case "menuos":
        diagramTitle = "OFFLINE-FIRST SYNCHRONIZATION // STATE RECONCILIATION QUEUE";
        asciiArt = `
[LOCAL-FIRST SYNC QUEUE & LAMPORT MERGE VECTOR]

   Waitstaff Tablets (Offline Nodes)          Kitchen Node (Hub Gateway)
 ┌───────────────────────────────────┐      ┌─────────────────────────────┐
 │ Waiter Tablet_A                   │      │ Central Dining POS Gateway  │
 │  1. Order Ring: Starter           │      │                             │
 │  2. SQLite local write            │      │  (Listen on WS Port 8080)   │
 │  3. Logical Clock (c = 13)        │      │                             │
 └─────────────────┬─────────────────┘      │  Receives Tablet_A (c=13)   │
                   │ (WebSockets)            │  Receives Tablet_B (c=12)   │
                   ├───────────────────────>│                             │
 ┌─────────────────┴─────────────────┐      │  [RECONCILER ACTION]        │
 │ Waiter Tablet_B                   │      │  Sort logs by Lamport time:  │
 │  1. Order Ring: Dessert           │      │   c=12 (Tablet_B) first      │
 │  2. SQLite local write            │      │   c=13 (Tablet_A) second     │
 │  3. Logical Clock (c = 12)        │      │                             │
 └───────────────────────────────────┘      │  Updates local Master DB    │
                                            └──────────────┬──────────────┘
                                                           │ (Background)
                                                           ▼
                                            ┌─────────────────────────────┐
                                            │ Cloud Postgres Database     │
                                            │  (Asynchronous sync queue)  │
                                            └─────────────────────────────┘`;
        break;

      case "tem":
        diagramTitle = "VOICE EXPENSE FLOW // TRANSACTIONS PROCESSING VECTOR";
        asciiArt = `
[TEM VOICE-FIRST EXPENSE CAPTURE PIPELINE]

   User Voice Input
         │
         ▼
   Speech-to-Text (Local/Remote Transcription)
         │
         ▼
   Amount Extraction (Entity Parsing)
         │
         ▼
   Category Suggestion (Tax/Expense Tagging)
         │
         ▼
   User Confirmation (Manual Approval Overlay)
         │
         ▼
   Local Expense Store (SQLite Ledger)
         │
         ▼
   Expense History (Active Recall HUD)`;
        break;

      case "household-os":
        diagramTitle = "COOPERATIVE FINANCIAL COORDINATION // LOCAL RECONCILIATION LOOP";
        asciiArt = `
[HOUSEHOLD OS ARCHITECTURE EXPLORATION]

       User A (Partner A View)           User B (Partner B View)
     ┌────────────────────────┐        ┌────────────────────────┐
     │ - SQLite Balance Model │        │ - SQLite Balance Model │
     │ - Manual Input Console │        │ - Manual Input Console │
     └───────────┬────────────┘        └───────────┬────────────┘
                 │                                 │
                 ▼                                 ▼
     ┌──────────────────────────────────────────────────────────┐
     │             LOCAL-FIRST RECONCILIATION HUD               │
     │                                                          │
     │  - Read local SQLite database state                      │
     │  - Evaluate commitments against static shared schema     │
     │  - Render unified shared pool (Income vs commitments)    │
     └───────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
                     [Manual Reconciliation CLI]
                     $ household reconcile --commit
                     1. Resolve unmatched ledger entries
                     2. Merge transactions to SQLite state`;
        break;

      case "dependency-mapping":
        diagramTitle = "DAG KNOWLEDGE TREE // TOPOLOGICAL PRUNING ENGINE";
        asciiArt = `
[DAG TOPOLOGICAL TREE TRAVERSAL PRUNING]

                 [Pointers Primitive Node] (Completed)
                             │
                             ▼
              [Memory Management Primitive] (Target Gap)
                             │
                             ▼
              [Garbage Collection Concept]
                             │
                             ▼
               [Advanced Compiler Core]
                             
       Traversing dependencies for "Garbage Collection":
       
       1. Identify target node: "Garbage Collection"
       2. Retrieve ancestor graph relationships from Neo4j
       3. Intersect user mastery vectors:
          - Completed: [Pointers]
          - Missing: [Memory Management]
       4. Prune graph nodes already mastered (Pointers)
       5. Render custom sub-DAG dynamically in client viewport`;
        break;

      case "cognition-rl":
        diagramTitle = "DURABLE AGENT STATE MACHINE // BUDGET CONTROLS";
        asciiArt = `
[DURABLE AGENT CONTROLLER EVALUATION LOOP]

        ┌────────────────────────────────────────┐
        │  User Request: Execute DB Schema Sync  │
        └───────────────────┬────────────────────┘
                            │
                            ▼
      ┌────────────────────────────────────────────┐
      │        STATE EVALUATOR CONTROLLER          │ <─────────┐
      │                                            │           │
      │  1. Assert current state (checkpoints/)    │           │
      │  2. Check remaining Step Budget (Max: 2)   │           │
      │  3. Construct context frame & rules        │           │
      └─────────────────────┬──────────────────────┘           │ (Validation Fail
                            │                                  │  Error feedback
                            ▼                                  │  & budget decr)
      ┌────────────────────────────────────────────┐           │
      │     PROBABILISTIC ENGINE (LLM AGENT)       │           │
      │                                            │           │
      │  - Parse environment context               │           │
      │  - Propose database migration script       │           │
      └─────────────────────┬──────────────────────┘           │
                            │                                  │
                            ▼                                  │
      ┌────────────────────────────────────────────┐           │
      │         STRICT SCHEMA VALIDATOR            │           │
      │                                            │           │
      │  - Parse generated script via AST compiler │           │
      │  - Execute optimistic dry-run validation  │ ──────────┘
      └─────────────────────┬──────────────────────┘
                            │ (Validation Success)
                            ▼
      ┌────────────────────────────────────────────┐
      │           PRODUCTION DATABASE              │
      │                                            │
      │  - Apply schema edits                      │
      │  - Commit state logs & terminate run       │
      └────────────────────────────────────────────┘`;
        break;

      default:
        diagramTitle = "SYSTEM TOPOLOGY DIAGRAM";
        asciiArt = `
[GENERIC SYSTEM VIEW]
       [Input State] ──> [Evaluator Guardrail] ──> [System Output]`;
        break;
    }

    return (
      <div className="w-full border border-border-subtle/50 rounded-xl overflow-hidden bg-card-bg/40 font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle/30 bg-background/50 text-[9px] text-text-muted font-mono font-semibold uppercase">
          <span>{diagramTitle}</span>
          <span>DIAGRAM</span>
        </div>
        <pre className="p-4 overflow-x-auto text-[10px] text-foreground/95 leading-relaxed scrollbar font-mono whitespace-pre">
          <code>{asciiArt.trim()}</code>
        </pre>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-12 md:py-20">
      {/* Back button */}
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-text-muted hover:text-accent font-semibold transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>BACK TO ARCHITECTURES</span>
      </Link>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side Panel (Metadata HUD) */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <span className="text-[10px] font-mono text-accent uppercase tracking-wider font-semibold">
                SYSTEM IDENTIFIER
              </span>
              <h1 className="font-heading text-2xl font-extrabold text-foreground tracking-tight mt-0.5">
                {project.title}
              </h1>
            </div>

            <p className="text-xs text-text-muted font-medium leading-relaxed font-sans border-b border-border-subtle pb-4">
              {project.tagline}
            </p>

            {/* Tech Stack list */}
            <div>
              <h3 className="font-mono text-[10px] text-foreground font-semibold tracking-wider uppercase mb-2">
                Core Stack Primitives
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded text-[10px] font-mono border border-border-subtle bg-background text-text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Impact Metric */}
            <div className="border-t border-border-subtle pt-4">
              <h3 className="font-mono text-[10px] text-foreground font-semibold tracking-wider uppercase mb-1">
                SYSTEMS IMPACT
              </h3>
              <p className="text-xs text-accent font-bold font-mono">
                {project.impact}
              </p>
            </div>

            {/* Timeline & Iterations */}
            <div className="border-t border-border-subtle pt-4">
              <h3 className="font-mono text-[10px] text-foreground font-semibold tracking-wider uppercase mb-1">
                Development History
              </h3>
              <p className="text-[11px] text-text-muted font-mono leading-relaxed">
                {project.timeline}
              </p>
            </div>

            {/* Repository Links */}
            {(project.github || project.demo) && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-border-subtle hover:border-accent/40 bg-background text-xs font-mono text-text-muted hover:text-foreground transition-all"
                  >
                    <svg
                      className="h-4.5 w-4.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                      <path d="M9 18c-4.51 2-5-2-7-2" />
                    </svg>
                    <span>INSPECT SOURCE CODE</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent hover:bg-accent/25 hover:border-accent text-xs font-mono font-bold transition-all"
                  >
                    <Globe className="h-4.5 w-4.5" />
                    <span>LAUNCH DEPLOYMENT</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Detail (Deep-Dive Blueprint) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Blueprint Layout Card */}
          <div className="glass rounded-2xl p-6 md:p-8 space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

            {/* SECTION 1: PROBLEM */}
            <section className="space-y-3 relative z-10">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                01 / Problem Statement
              </h2>
              <div className="font-sans text-sm text-text-muted leading-relaxed font-medium space-y-4">
                <p>{project.problem}</p>
                <div className="border-l-2 border-accent/40 pl-4 py-1 bg-accent/2 rounded-r-lg">
                  <h3 className="font-mono text-[10px] text-foreground font-bold uppercase tracking-wider mb-1">
                    Why legacy models collapse
                  </h3>
                  <p className="text-xs">{project.whyFailed}</p>
                </div>
              </div>
            </section>

            {/* SECTION 2: INSIGHT */}
            <section className="space-y-3 relative z-10 border-t border-border-subtle/50 pt-8">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="h-4 w-4 shrink-0" />
                02 / Core Thesis & Philosophy
              </h2>
              <div className="font-sans text-sm text-text-muted leading-relaxed font-medium space-y-3">
                <p className="text-foreground/90 italic font-semibold">&ldquo;{project.insight}&rdquo;</p>
                <p>{project.philosophy}</p>
              </div>
            </section>

            {/* FLAGSHIP DIAGNOSTIC (if whyExists exists) */}
            {project.whyExists && (
              <section className="space-y-6 relative z-10 border-t border-border-subtle/50 pt-8">
                <h2 className="font-mono text-xs text-[#ffc67a] font-bold uppercase tracking-wider flex items-center gap-2">
                  <Server className="h-4.5 w-4.5 shrink-0" />
                  02b / Flagship Diagnostic // Architectural Isolation
                </h2>
                
                <div className="font-mono text-xs text-text-muted leading-relaxed space-y-6">
                  <p className="text-foreground/95 bg-[#ffc67a]/5 p-3.5 rounded-lg border border-[#ffc67a]/20">
                    {project.whyExists}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono">
                    {/* Pain Points */}
                    <div className="space-y-3 border border-border-subtle/40 rounded-xl p-4 bg-background/25">
                      <div className="text-[10px] text-[#ff6b6b] font-bold uppercase tracking-wider border-b border-border-subtle/30 pb-1.5 mb-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ff6b6b] animate-pulse" />
                        [PAIN_POINTS_IN_THE_WILD]
                      </div>
                      <ul className="space-y-2 list-none pl-0">
                        {project.painPoints?.map((pt, idx) => (
                          <li key={idx} className="text-[11px] leading-relaxed flex items-start gap-2">
                            <span className="text-[#ff6b6b] font-bold select-none shrink-0">!</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Operational Design Decisions */}
                    <div className="space-y-3 border border-border-subtle/40 rounded-xl p-4 bg-background/25">
                      <div className="text-[10px] text-accent font-bold uppercase tracking-wider border-b border-border-subtle/30 pb-1.5 mb-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        [OPERATIONAL_DESIGN_DECISIONS]
                      </div>
                      <ul className="space-y-2 list-none pl-0">
                        {project.designDecisions?.map((dec, idx) => (
                          <li key={idx} className="text-[11px] leading-relaxed flex items-start gap-2">
                            <span className="text-accent font-bold select-none shrink-0">&gt;</span>
                            <span>{dec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* What Broke Detailed */}
                  {project.whatBrokeDetailed && (
                    <div className="space-y-3 border border-[#ff6b6b]/10 rounded-xl p-4 bg-[#1e1c19]/35">
                      <div className="text-[10px] text-[#ffc67a] font-bold uppercase tracking-wider border-b border-border-subtle/30 pb-1.5 mb-2 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ffc67a] animate-pulse" />
                        [PRODUCTION_FAILURES_&_DEBUG_LOGS]
                      </div>
                      <ul className="space-y-2 list-none pl-0">
                        {project.whatBrokeDetailed.map((broke, idx) => (
                          <li key={idx} className="text-[11px] leading-relaxed flex items-start gap-2">
                            <span className="text-[#ffc67a] font-bold select-none shrink-0">#</span>
                            <span>{broke}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* SECTION 3: SYSTEM ARCHITECTURE DIAGRAM */}
            <section className="space-y-4 relative z-10 border-t border-border-subtle/50 pt-8">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <Workflow className="h-4 w-4 shrink-0" />
                03 / Topology Diagram
              </h2>
              {renderSystemDiagram(project.slug)}
              {project.slug === "menuos" && (
                <div className="mt-4 border border-border-subtle/50 rounded-xl overflow-hidden bg-card-bg/25">
                  <div className="px-4 py-2 border-b border-border-subtle/30 bg-background/50 text-[10px] font-mono text-text-muted">
                    VISUAL_PROOF // SCREENSHOT: OFFLINE TABLET ORDERING INTERFACE
                  </div>
                  <div className="p-4 flex flex-col items-center">
                    <img 
                      src="/images/menuos_pos.png" 
                      alt="MenuOS Tablet Interface" 
                      className="max-h-[350px] w-auto border border-border-subtle/40 rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              )}
              {/* Build Artifact Terminal Output */}
              <div className="mt-4 border border-border-subtle/50 rounded-xl overflow-hidden bg-card-bg/40 font-mono text-xs">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle/30 bg-background/50 text-[9px] text-text-muted font-mono">
                  <span className="font-semibold uppercase">BUILD_ARTIFACT // RAW_SYSTEM_OUTPUT</span>
                  <span>LOGS</span>
                </div>
                <pre className="p-4 overflow-x-auto text-[10px] text-foreground/95 leading-relaxed scrollbar font-mono">
                  <code>{project.buildArtifact}</code>
                </pre>
              </div>
            </section>

            {/* SECTION 4: DETAILED DECISIONS */}
            <section className="space-y-3 relative z-10 border-t border-border-subtle/50 pt-8">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <Server className="h-4 w-4 shrink-0" />
                04 / Structural Setup & Flow
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed font-medium">
                {project.architecture}
              </p>
            </section>

            {/* SECTION 5: TRADEOFFS */}
            <section className="space-y-4 relative z-10 border-t border-border-subtle/50 pt-8">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <Code className="h-4 w-4 shrink-0" />
                05 / Tradeoffs & Implementation Friction
              </h2>
              <p className="font-sans text-sm text-text-muted leading-relaxed font-medium">
                {project.challenges}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 rounded-xl border border-border-subtle/50 bg-[#1e1c19]/35 text-text-muted space-y-1.5">
                  <h4 className="font-mono text-[9px] text-[#ffc67a] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffc67a] animate-pulse" />
                    OPERATIONAL_NOTE // WHAT BROKE
                  </h4>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    {project.operationalNote}
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border-subtle/50 bg-background/30 text-text-muted space-y-1.5">
                  <h4 className="font-mono text-[9px] text-accent font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    IMPLEMENTATION_COMPROMISE
                  </h4>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    {project.compromise}
                  </p>
                </div>
              </div>

              {project.deprecatedApproach && (
                <div className="p-4 rounded-xl border border-border-subtle/50 bg-background/15 text-text-muted space-y-1.5 mt-4">
                  <h4 className="font-mono text-[9px] text-text-muted/80 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted/40" />
                    DEPRECATED_APPROACH // AVOIDED PATH
                  </h4>
                  <p className="text-xs leading-relaxed font-sans font-medium">
                    {project.deprecatedApproach}
                  </p>
                </div>
              )}
            </section>

            {/* SECTION 6: LESSONS & FUTURE VECTORS */}
            <section className="space-y-3 relative z-10 border-t border-border-subtle/50 pt-8">
              <h2 className="font-mono text-xs text-accent font-bold uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="h-4 w-4 shrink-0" />
                06 / Learnings & Evolutionary Vectors
              </h2>
              <div className="font-sans text-sm text-text-muted leading-relaxed font-medium space-y-4">
                <p>{project.lessons}</p>
                <div className="p-4 rounded-xl border border-border-subtle bg-background/45 space-y-1">
                  <h3 className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider">
                    NEXT VERSION GOALS
                  </h3>
                  <p className="text-xs font-semibold">{project.future}</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
