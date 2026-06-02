import { Terminal, Zap, BookOpen, AlertTriangle, WifiOff, Layers } from "lucide-react";
import HowIThink from "@/components/HowIThink";
import OfflineSyncSimulator from "@/components/OfflineSyncSimulator";

export default function SystemsPage() {
  const deepPrinciples = [
    {
      title: "Systems should fail predictably.",
      subtitle: "Deterministic Degradation Path",
      icon: AlertTriangle,
      content: "Unexpected failure modes destroy operational trust faster than missing features. We design architectures with bounded error loops, clear panic thresholds, and active diagnostics so that when a failure occurs, the system fails cleanly and transparently instead of drifting silently."
    },
    {
      title: "Local-first beats cloud-first during chaos.",
      subtitle: "Offline Autonomy & Graceful Degradation",
      icon: WifiOff,
      content: "When networks fail, workflows should degrade gracefully instead of collapsing entirely. Storing state locally first and syncing asynchronously ensures that physical operations—like restaurant POS queues or terminal pipelines—continue uninterrupted."
    },
    {
      title: "Coordination complexity compounds faster than feature complexity.",
      subtitle: "The Concurrency Penalty",
      icon: Layers,
      content: "Most software dies from synchronization failures, not missing functionality. We design systems to minimize shared state contamination, relying on deterministic message routing and clear transactional boundaries."
    },
    {
      title: "Fast feedback loops are infrastructure.",
      subtitle: "DX Friction Reduction",
      icon: Zap,
      content: "Slow tooling silently destroys engineering momentum. If compiling code, syncing database schemas, or running tests takes longer than 200ms, context switching creeps in. We treat developer tooling speed as a core infrastructure metric."
    },
    {
      title: "Operational clarity > architectural cleverness.",
      subtitle: "Stress-Testing Comprehensibility",
      icon: Terminal,
      content: "The best systems are understandable under stress. We reject microservice bloat and abstract configurations. We build flat, readable codepaths, clear telemetry streams, and simple schemas that can be audited in minutes during live outages."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl w-full px-6 md:px-8 py-16 md:py-24 space-y-16">
      {/* Header */}
      <div className="space-y-4 max-w-3xl border-b border-border-subtle/50 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <BookOpen className="h-3 w-3" />
          <span>SYSTEMS_THINKING_MUSEUM</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          How I Think
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          A collection of essays and operational principles detailing my approach to software architecture, cognitive friction, and AI product design.
        </p>
      </div>

      {/* Interactive Playground Widget */}
      <div className="space-y-6">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          INTERACTIVE PHILOSOPHY MAP
        </h3>
        <HowIThink />
      </div>

      {/* Interactive System Simulator */}
      <div className="space-y-6 pt-8 border-t border-border-subtle/50">
        <h3 className="font-mono text-xs text-[#ffc67a] uppercase tracking-wider font-bold">
          INTERACTIVE SYSTEM SIMULATOR // REPLAY ENGINE
        </h3>
        <OfflineSyncSimulator />
      </div>

      {/* System Failure Atlas */}
      <div className="space-y-8 pt-8 border-t border-border-subtle/50">
        <div className="space-y-2">
          <h3 className="font-mono text-xs text-[#ff6b6b] uppercase tracking-wider font-bold">
            SYSTEM_FAILURE_ATLAS // DIAGNOSTIC DATABASE
          </h3>
          <p className="text-xs text-text-muted font-mono leading-relaxed max-w-2xl">
            A real-world catalog of operational failure modes, synchronization anomalies, and execution bottlenecks observed across production deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Queue Replay Failures */}
          <div className="border border-[#ff6b6b]/20 bg-[#ff6b6b]/2 px-5 py-6 rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#ff6b6b]/10 pb-2">
              <span className="text-[#ff6b6b] font-bold">[0x01_QUEUE_REPLAY]</span>
              <span className="text-[10px] text-text-muted">STATE_UNSTABLE</span>
            </div>
            <ul className="space-y-3 list-none">
              <li className="space-y-1">
                <span className="text-foreground font-bold">DUPLICATE_WRITES</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Overlapping HTTP retries or webhook duplicates writing redundant state records into Postgres before transactions commit.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">REPLAY_STORMS</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Cascading worker connection timeouts when a database recovery event triggers simultaneous processing of 10,000+ backlog items.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">STALE_OFFSETS</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Redis transaction crashes causing queue consumers to lose tracking of cursor offsets, resulting in execution loops of historical data.
                </p>
              </li>
            </ul>
          </div>

          {/* Offline Sync Failures */}
          <div className="border border-[#ffc67a]/20 bg-[#ffc67a]/2 px-5 py-6 rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#ffc67a]/10 pb-2">
              <span className="text-[#ffc67a] font-bold">[0x02_OFFLINE_SYNC]</span>
              <span className="text-[10px] text-text-muted">CONCURRENCY_CONFLICT</span>
            </div>
            <ul className="space-y-3 list-none">
              <li className="space-y-1">
                <span className="text-foreground font-bold">CLOCK_DRIFT</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Waitstaff tablet clocks diverging by up to 45s, causing order logs to sort incorrectly chronologically (e.g. desserts before starters).
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">STALE_MERGES</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Concurrent SQLite transactions overwriting server-side Postgres updates without checking logical revision vectors.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">SPLIT_BRAIN_STATE</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Dining network partitions allowing two tablets to independently claim and close the same table ID, corrupting checkout counts.
                </p>
              </li>
            </ul>
          </div>

          {/* Developer Workflow Failures */}
          <div className="border border-border-subtle bg-card-bg/20 px-5 py-6 rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border-subtle/30 pb-2">
              <span className="text-text-muted font-bold">[0x03_WORKFLOW_DX]</span>
              <span className="text-[10px] text-text-muted">CYCLE_FRICTION</span>
            </div>
            <ul className="space-y-3 list-none">
              <li className="space-y-1">
                <span className="text-foreground font-bold">DOCKER_ONBOARD_FRICTION</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Volume mapping permissions and network interfaces crashing on local Windows hosts, stalling developer environments for days.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">BROKEN_LOCAL_PARITY</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Relying on stubbed mock interfaces that fail to reproduce live rate-limiting, edge latency, and socket timeouts during dev test runs.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">STALE_ENV_VARIABLES</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Local cache configurations remaining active across schema updates, causing background workers to hit missing database tables.
                </p>
              </li>
            </ul>
          </div>

          {/* AI Runtime Failures */}
          <div className="border border-accent/20 bg-accent/2 px-5 py-6 rounded-xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-accent/10 pb-2">
              <span className="text-accent font-bold">[0x04_AI_RUNTIME]</span>
              <span className="text-[10px] text-text-muted">PROBABILISTIC_COLLAPSE</span>
            </div>
            <ul className="space-y-3 list-none">
              <li className="space-y-1">
                <span className="text-foreground font-bold">INFINITE_LOOPS</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Stochastic agents repeatedly executing identical database operations in a loop when custom tools output unexpected JSON validation errors.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">TOKEN_RUNAWAY</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Runaway agent loop queries executing 40 API calls in under 100 seconds, consuming $15 of commercial token budget in two minutes.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">MEMORY_CONTAMINATION</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Concurrent request states leaking variables into shared agent contexts, leading to hallucinations of one tenant's data into another.
                </p>
              </li>
              <li className="space-y-1">
                <span className="text-foreground font-bold">RETRY_EXPLOSIONS</span>
                <p className="text-[11px] text-text-muted font-sans leading-relaxed">
                  Uncapped backoff policies on API failures flooding downstream services and causing permanent API gateway rate locks.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Operational Principles Grid */}
      <div className="space-y-8 pt-8 border-t border-border-subtle/50">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          OPERATIONAL_PRINCIPLES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deepPrinciples.map((principle) => {
            const Icon = principle.icon;
            return (
              <div 
                key={principle.title}
                className="glass rounded-xl p-6 md:p-8 space-y-4 hover:border-accent/30 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 h-24 w-24 bg-accent/5 rounded-bl-full pointer-events-none opacity-50 group-hover:bg-accent/10 transition-colors" />
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg border border-border-subtle bg-background text-accent">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base md:text-lg font-bold text-foreground leading-snug">
                      {principle.title}
                    </h4>
                    <span className="text-[10px] font-mono text-text-muted">
                      {principle.subtitle.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-muted leading-relaxed font-sans font-medium pt-2 border-t border-border-subtle/30">
                  {principle.content}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
