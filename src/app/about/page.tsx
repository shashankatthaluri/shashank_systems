import { Sparkles, Terminal, Compass, Flame, Cpu, ArrowRight } from "lucide-react";
import { aboutData } from "@/content/data";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl w-full px-6 py-16 md:py-24 space-y-16">
      {/* Header */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
          <Compass className="h-3 w-3" />
          <span>OPERATING_PHILOSOPHY</span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Shashank Atthaluri
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          I build operating systems for human coordination. Every product I ship solves the same root problem: humans carry too much in their heads, and software should carry it instead. I am less interested in building features than in identifying what humans are being forced to remember and designing systems that make remembering unnecessary.
        </p>
      </div>

      {/* WHY I BUILD — Founder Thesis */}
      <div className="space-y-6 p-6 md:p-8 rounded-2xl border border-accent/20 bg-accent/5">
        <div className="space-y-1">
          <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider">FOUNDER THESIS</span>
          <h2 className="font-heading text-xl font-extrabold tracking-tight text-foreground">
            Why I build
          </h2>
        </div>
        <p className="text-sm text-text-muted leading-relaxed font-sans font-medium max-w-2xl">
          Every business I&rsquo;ve studied runs on informal memory. Orders passed by shouting. Finances tracked in spreadsheets. Setup steps remembered by one person. Tax estimates held in someone&rsquo;s head.
        </p>
        <p className="text-sm text-text-muted leading-relaxed font-sans font-medium max-w-2xl">
          When that memory fails &mdash; and it always does &mdash; things break. Not because people are careless. Because the software never took over the job.
        </p>
        <div className="border-l-2 border-accent/50 pl-4 py-1">
          <p className="text-sm font-mono text-foreground font-semibold leading-relaxed">
            Reduce cognitive load by transforming fragile human memory and coordination into reliable software systems.
          </p>
        </div>
        <p className="text-xs text-text-muted leading-relaxed font-sans font-medium max-w-2xl">
          That&rsquo;s the thesis. ShipClawFast removes setup memory. MenuOS removes operational coordination memory. TEM removes financial tracking memory. Household OS explores shared coordination memory. Same problem, different domain.
        </p>
      </div>

      {/* Section 1: Operating Philosophy */}
      <div className="space-y-8">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          01 // Operating Philosophy
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aboutData.operatingPhilosophy.map((op, idx) => (
            <div key={op.title} className="glass rounded-xl p-6 space-y-3 border-border-subtle/45">
              <span className="font-mono text-xs text-accent font-bold">PH_0{idx + 1}</span>
              <h4 className="font-heading text-base font-bold text-foreground">{op.title}</h4>
              <p className="text-xs text-text-muted leading-relaxed font-sans font-medium">
                {op.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Narrative Arc */}
      <div className="space-y-8 pt-8 border-t border-border-subtle/50">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          02 // Evolution of Interests (Narrative Arc)
        </h3>
        
        {/* Visual Timeline */}
        <div className="relative border-l border-border-subtle/70 pl-6 md:pl-8 ml-3 space-y-10">
          {aboutData.narrativeArc.map((arc, idx) => (
            <div key={arc.phase} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1 h-4 w-4 rounded-full border-2 border-background bg-accent flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </div>
              
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-accent font-bold">
                  PHASE_0{idx + 1} // {arc.phase.toUpperCase()}
                </span>
                <h4 className="font-heading text-lg font-bold text-foreground">
                  {arc.phase}
                </h4>
                <p className="text-sm text-text-muted leading-relaxed max-w-2xl font-sans font-medium">
                  {arc.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Why Systems & Cognition Matter */}
      <div className="space-y-4 pt-8 border-t border-border-subtle/50 max-w-3xl">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          03 // Why Systems & Cognition Matter
        </h3>
        <div className="text-sm md:text-base text-text-muted leading-relaxed font-sans font-medium space-y-4">
          <p>
            Software is no longer just a pipeline that takes database fields and maps them to forms. In the era of language models and agentic computing, software behaves probabilistically. Building stable products in this ecosystem demands wrapping probabilistic intelligence in strict, deterministic system boundaries.
          </p>
          <p>
            Similarly, user interfaces must adapt. An AI-native interface shouldn&rsquo;t overwhelm the user with chatbot interfaces. It should proactively offload cognitive tasks, predicting intent and exposing actions through progressive disclosures and keyboard command palleted systems. I build software that respects both developer flow and operator sanity.
          </p>
        </div>
      </div>

      {/* Section 4: Curiosity Archive & Explorations */}
      <div className="space-y-8 pt-8 border-t border-border-subtle/50">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          04 // Curiosity Archive & Explorations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutData.curiosityArchive?.map((archive) => (
            <div key={archive.title} className="space-y-3">
              <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {archive.title}
              </h4>
              <ul className="space-y-2">
                {archive.items.map((item) => (
                  <li key={item} className="text-xs text-text-muted leading-relaxed font-sans font-medium flex items-start gap-2">
                    <span className="text-accent font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Current Mission & Approaches */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-subtle/50">
        <div className="space-y-3">
          <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-accent" />
            05 // CURRENT MISSION
          </h3>
          <p className="text-sm text-text-muted leading-relaxed font-sans font-medium">
            Helping seed and Series-A startup founders quickly formulate, build, and scale their AI-native MVP concepts, transforming complex backend engineering concepts into fluid operational software.
          </p>
        </div>
        <div className="space-y-3">
          <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-accent" />
            LONG-TERM VECTORS
          </h3>
          <ul className="space-y-2">
            {aboutData.longTermInterests.map((interest) => (
              <li key={interest} className="flex items-start gap-2 text-sm text-text-muted font-sans font-medium">
                <ArrowRight className="h-4 w-4 text-accent/80 shrink-0 mt-0.5" />
                <span>{interest}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Section 6: Convictions, Opinions & Taste */}
      <div className="space-y-8 pt-8 border-t border-border-subtle/50">
        <h3 className="font-mono text-xs text-text-muted uppercase tracking-wider font-bold">
          06 // Software Convictions & Operational Taste
        </h3>
        
        {/* Tier 1 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider text-foreground flex items-center gap-2 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Things I Believe
            </h4>
            <ul className="space-y-3">
              {aboutData.thingsIBelieve?.map((item) => (
                <li key={item} className="text-xs text-text-muted leading-relaxed font-sans font-medium flex gap-2">
                  <span className="text-accent shrink-0 font-bold font-mono">::</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider text-foreground flex items-center gap-2 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              What I Optimize For
            </h4>
            <ul className="space-y-3">
              {aboutData.whatIOptimizeFor?.map((item) => (
                <li key={item} className="text-xs text-text-muted leading-relaxed font-sans font-medium flex gap-2">
                  <span className="text-emerald-500 shrink-0 font-bold font-mono">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider text-foreground flex items-center gap-2 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Software Frustrations
            </h4>
            <ul className="space-y-3">
              {aboutData.softwareFrustrations?.map((item) => (
                <li key={item} className="text-xs text-text-muted leading-relaxed font-sans font-medium flex gap-2">
                  <span className="text-rose-500 shrink-0 font-bold font-mono">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tier 2 Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border-subtle/30">
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider text-foreground flex items-center gap-2 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ffc67a]" />
              What I&rsquo;ve Changed My Mind About
            </h4>
            <ul className="space-y-3">
              {aboutData.whatIChangedMyMindAbout?.map((item) => (
                <li key={item} className="text-xs text-text-muted leading-relaxed font-sans font-medium flex gap-2">
                  <span className="text-[#ffc67a] shrink-0 font-bold font-mono">#</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold tracking-wider text-foreground flex items-center gap-2 uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-border-subtle" />
              Tools I Keep Returning To
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {aboutData.toolsIKeepReturningTo?.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-mono border border-border-subtle/50 bg-card-bg/25 text-foreground/95 font-bold"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
