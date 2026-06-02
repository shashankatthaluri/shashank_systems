import { Terminal, Activity, ArrowRight, Eye, Calendar } from "lucide-react";
import { nowData } from "@/content/data";

export default function NowPage() {
  return (
    <div className="mx-auto max-w-3xl w-full px-6 py-16 md:py-24 space-y-12">
      {/* Header */}
      <div className="space-y-4 border-b border-border-subtle/50 pb-8">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
            <Activity className="h-3 w-3 animate-pulse" />
            <span>REALTIME_SYS_STATUS</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            LATEST_UPDATE: MAY 2026
          </span>
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          What I&rsquo;m Doing Now
        </h1>
        <p className="text-base text-text-muted leading-relaxed font-sans font-medium">
          This is a status dashboard inspired by Derek Sivers&rsquo; <a href="https://nownownow.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline font-semibold">/now movement</a>. It catalogs my current operational objectives, research topics, and focus vectors.
        </p>
      </div>

      {/* Dense Terminal Diagnostic Window */}
      <div className="border border-border-subtle rounded-xl overflow-hidden bg-card-bg/40 font-mono shadow-xl relative">
        <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
        
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-subtle bg-background/80 text-[10px] text-text-muted">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-accent" />
            <span className="font-semibold uppercase tracking-wider">shashank_atthaluri@operator-node:~</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">STATUS_ACTIVE</span>
          </div>
        </div>

        {/* Console Body */}
        <div className="p-4 md:p-6 space-y-6 text-xs text-foreground/90 leading-relaxed font-mono">
          <div>
            <span className="text-text-muted/60 select-none">$ </span>
            <span className="text-accent font-semibold">tail -n 25 /var/log/active_objectives.log</span>
          </div>
          
          <div className="space-y-6 pt-2">
            {nowData.map((item, idx) => (
              <div key={item.category} className="space-y-2 border-l border-border-subtle/40 pl-3">
                <div className="flex items-center gap-2 text-[10px] text-accent font-bold uppercase tracking-wider">
                  <span>LOG_ENTRY_0{idx + 1}</span>
                  <span>//</span>
                  <span className="text-foreground">{item.category.toUpperCase()}</span>
                </div>
                
                <ul className="space-y-1.5">
                  {item.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2 text-[11px] text-text-muted">
                      <span className="text-accent/65 font-bold shrink-0">&gt;</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border-subtle/30 text-[10px] text-text-muted/65">
            <span className="text-text-muted/40 select-none">$ </span>
            <span>echo $CURRENT_OBSESSION</span>
            <div className="mt-1 text-accent font-bold">
              "REDUCING RUNTIME LATENCY AND OPTIMIZING CACHE BOUNDARIES"
            </div>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center gap-2 text-[10px] font-mono text-text-muted/65 border-t border-border-subtle/30 pt-6">
        <Eye className="h-3.5 w-3.5 text-accent shrink-0" />
        <span>CURRENT SYSTEM TIMESTAMPS GENERATED LOCALLY FROM ENFORCED LAMPORT LOGICAL CLOCKS</span>
      </div>
    </div>
  );
}
