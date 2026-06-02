import { Sparkles, Terminal, ShieldCheck, Sliders, RefreshCw, Layers, Cpu, CheckCircle } from "lucide-react";

export default function PhilosophyPage() {
  const principles = [
    {
      id: "01",
      title: "Software should remove obligations.",
      detail: "Most software adds work: fields to fill, forms to audit, notifications to dismiss. High-utility software acts like infrastructure — it quietly absorbs human responsibilities so you can stop thinking about them.",
      icon: ShieldCheck,
    },
    {
      id: "02",
      title: "Operational clarity beats architectural cleverness.",
      detail: "Simple, readable code that a junior engineer can debug at 2 AM is infinitely superior to complex abstractions and clever microservices that look/feel beautiful on paper but collapse under real-world load.",
      icon: Sliders,
    },
    {
      id: "03",
      title: "Systems fail at boundaries.",
      detail: "Core processing logic is rarely the failure point. Systems break where they handshake: API edges, network transit, database transaction boundaries, and human-to-computer handoffs. Design for the handshakes.",
      icon: Layers,
    },
    {
      id: "04",
      title: "Local-first is graceful degradation.",
      detail: "Cloud networks are inherently fragile and unpredictable. Storing state on the client and syncing asynchronously isn't just an optimization; it's the only way to build software that survives network loss.",
      icon: Cpu,
    },
    {
      id: "05",
      title: "Humans should not be synchronization engines.",
      detail: "When operations require people to pass order status, copy tax data to spreadsheets, or remember environment variables, it's a design failure. The machine should track the state.",
      icon: RefreshCw,
    },
    {
      id: "06",
      title: "Feedback loops determine velocity.",
      detail: "Development speed isn't about lines of code per hour. It's determined by the latency of feedback loops: local hot-reloads, fast compiler passes, simple unit test commands, and direct user feedback.",
      icon: Terminal,
    },
    {
      id: "07",
      title: "Trust over automation.",
      detail: "Runaway LLM agent loops and over-automated ledger syncs make mistakes that take longer to resolve than manual entry. Build systems that handle parsing and preparation, but leave key decisions to a single-tap user verification.",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <Sparkles className="h-3 w-3" />
          <span>OPERATING_BLUEPRINTS</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Operating Philosophy
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          A Sivers-inspired collection of opinionated system design principles. This is the worldview that guides how I build software, manage state, and design human-computer interactions.
        </p>
      </div>

      {/* Principles Panel */}
      <div className="space-y-6">
        {principles.map((pr) => {
          const Icon = pr.icon;
          return (
            <div
              key={pr.id}
              className="group p-6 rounded-xl border border-border-subtle/40 bg-card-bg/15 hover:border-accent/30 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg border border-border-subtle/70 bg-background text-text-muted group-hover:text-accent group-hover:border-accent/40 transition-colors shrink-0 mt-0.5">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-accent tracking-wider font-bold">
                      PRINCIPLE_{pr.id}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-foreground group-hover:text-accent transition-colors">
                    {pr.title}
                  </h3>
                  <p className="text-xs md:text-sm text-text-muted leading-relaxed font-sans font-medium">
                    {pr.detail}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* System diagnostics footer */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/65 border-t border-border-subtle/30 pt-6">
        <Terminal className="h-3.5 w-3.5 text-accent shrink-0" />
        <span>SYS_RULES: DECISIONS_BACKED_BY_DETERMINISTIC_COMPILATION_AND_LOGICAL_CLOCKS</span>
      </div>
    </div>
  );
}
