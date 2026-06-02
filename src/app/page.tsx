import Link from "next/link";
import { ArrowRight, FileText, ArrowUpRight, Terminal, BookOpen, Network, Sparkles } from "lucide-react";
import SystemsVisual from "@/components/SystemsVisual";
import HowIThink from "@/components/HowIThink";
import SystemMap from "@/components/SystemMap";
import { projects, posts } from "@/content/data";

export default function Home() {
  // Get top 3 featured projects
  const featuredProjects = projects.slice(0, 3);
  
  // Get top 3 recent blog posts
  const recentPosts = posts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1 — HERO */}
      <section className="relative border-b border-border-subtle/50 bg-background overflow-hidden py-16 md:py-28">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Hero Context */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[11px] font-mono text-accent tracking-wider font-semibold">
              <Sparkles className="h-3 w-3" />
              <span>BUILDING OPERATIONAL SYSTEMS FOR AI-NATIVE SOFTWARE</span>
            </div>
            
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.05]">
              I build software that remembers so <span className="text-accent">people don't have to</span>.
            </h1>
            
            <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl font-sans font-medium">
              I build operating systems for human coordination — software that carries the cognitive load of running a business, so founders and operators never have to hold it in their heads.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/work"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-white font-medium hover:bg-accent-dim transition-all shadow-[0_0_20px_rgba(224,106,59,0.15)] group"
              >
                <span>View Shipped Work</span>
                <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/writing"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border-subtle hover:border-accent/40 bg-card-bg/50 hover:bg-accent/5 text-foreground transition-all"
              >
                <span>Read Build Logs</span>
              </Link>
              <a
                href="https://github.com/shashankatthaluri"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-2.5 rounded-lg border border-border-subtle bg-card-bg/40 text-text-muted hover:text-foreground transition-all"
                title="GitHub Profiles"
              >
                <svg
                  className="h-5 w-5"
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
              </a>
              <Link
                href="/about"
                className="flex items-center justify-center p-2.5 rounded-lg border border-border-subtle bg-card-bg/40 text-text-muted hover:text-foreground transition-all"
                title="Operating Philosophy & Resume"
              >
                <FileText className="h-5 w-5" />
              </Link>
            </div>

            {/* Operational Domains */}
            <div className="border-t border-border-subtle/50 pt-6 mt-8">
              <span className="text-[10px] font-mono text-accent uppercase tracking-wider block font-bold mb-3">
                OPERATIONAL_DOMAINS // SYSTEM ARCHITECTURES
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-border-subtle/50 bg-card-bg/25">
                  <div className="text-xs font-mono font-bold text-foreground">DEV INFRASTRUCTURE</div>
                  <div className="text-[10px] text-text-muted font-sans mt-1 leading-normal">Deterministic local environments and fast feedback loops.</div>
                </div>
                <div className="p-3 rounded-lg border border-border-subtle/50 bg-card-bg/25">
                  <div className="text-xs font-mono font-bold text-foreground">OFFLINE COORDINATION</div>
                  <div className="text-[10px] text-text-muted font-sans mt-1 leading-normal">Local-first sync protocols and distributed state managers.</div>
                </div>
                <div className="p-3 rounded-lg border border-border-subtle/50 bg-card-bg/25">
                  <div className="text-xs font-mono font-bold text-foreground">PERSONAL MEMORY</div>
                  <div className="text-[10px] text-text-muted font-sans mt-1 leading-normal">Software that carries cognitive load so people don't have to.</div>
                </div>
                <div className="p-3 rounded-lg border border-border-subtle/50 bg-card-bg/25">
                  <div className="text-xs font-mono font-bold text-foreground">AI RUNTIME RELIABILITY</div>
                  <div className="text-[10px] text-text-muted font-sans mt-1 leading-normal">Deterministic state machines and budget guardrails for LLMs.</div>
                </div>
              </div>
            </div>
            {/* Supporting Line below Metrics */}
            <div className="mt-4 border-l-2 border-accent/40 pl-4 py-1">
              <p className="text-xs font-mono text-foreground font-semibold leading-relaxed">
                &ldquo;Most software breaks at the edges: network loss, state drift, slow feedback loops, and operational chaos.&rdquo;
              </p>
            </div>
 
            {/* Live System Signals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t border-border-subtle/50 pt-6 text-[10px] font-mono">
              <div className="space-y-2">
                <span className="text-accent uppercase tracking-wider block font-bold">
                  SYS_MONITOR // CURRENTLY_DEBUGGING
                </span>
                <ul className="space-y-1 text-text-muted">
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-[#ffc67a] rounded-full animate-ping shrink-0" />
                    <span>SQLite branch drift during local-first sync replay</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-[#ffc67a] rounded-full animate-ping shrink-0" />
                    <span>Markdown AST parsing performance bottlenecks</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-[#ffc67a] rounded-full animate-ping shrink-0" />
                    <span>Command palette keyboard latency</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <span className="text-accent uppercase tracking-wider block font-bold">
                  BUILD_ACTIVITY // RECENT_COMMITS
                </span>
                <ul className="space-y-1 text-text-muted">
                  <li className="flex items-center gap-1.5">
                    <span className="text-accent font-bold shrink-0">&gt;</span>
                    <span>Refactored queue replay worker</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-accent font-bold shrink-0">&gt;</span>
                    <span>Removed optimistic sync fallback</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-accent font-bold shrink-0">&gt;</span>
                    <span>Added command palette fuzzy indexing</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="text-accent font-bold shrink-0">&gt;</span>
                    <span>Testing adaptive typography density</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Hero Systems Visual */}
          <div className="lg:col-span-5 border border-border-subtle/50 rounded-2xl bg-card-bg/25 overflow-hidden backdrop-blur-sm shadow-xl">
            <SystemsVisual />
          </div>

        </div>
      </section>

      {/* SECTION 2 — FEATURED WORK */}
      <section className="border-b border-border-subtle/50 py-20 px-6 md:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">SELECTED PRODUCTIONS</span>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight mt-1">Featured Work</h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-text-muted hover:text-accent font-semibold transition-colors group"
            >
              <span>EXPLORE ALL ARCHITECTURES</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Case Studies Column Layout */}
          <div className="space-y-16">
            {featuredProjects.map((project, idx) => (
              <div 
                key={project.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-border-subtle/30 pb-16 last:border-b-0 last:pb-0"
              >
                {/* Visual / Info Metadata block */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="font-mono text-xs text-accent">0{idx + 1} // CASE_STUDY</div>
                  <h3 className="font-heading text-2xl font-bold tracking-tight">{project.title}</h3>
                  <p className="text-sm text-text-muted font-medium leading-relaxed">{project.tagline}</p>
                  
                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono border border-border-subtle/80 bg-card-bg/60 text-text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Link
                      href={`/work/${project.slug}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-white transition-colors group"
                    >
                      <span>Read System Breakdown</span>
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Architectural Breakdown block */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-card-bg/30 border border-border-subtle/40 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                  <div>
                    <h4 className="font-mono text-xs text-foreground/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-accent" />
                      THE PROBLEM
                    </h4>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed font-sans font-medium">
                      {project.problem}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs text-foreground/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-accent" />
                      THE INSIGHT
                    </h4>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed font-sans font-medium">
                      {project.insight}
                    </p>
                  </div>
                  <div className="md:col-span-2 border-t border-border-subtle/30 pt-4 mt-2">
                    <h4 className="font-mono text-xs text-foreground/80 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Terminal className="h-3.5 w-3.5 text-accent" />
                      SYSTEM ARCHITECTURE
                    </h4>
                    <p className="text-sm text-text-muted mt-2 leading-relaxed font-sans font-medium">
                      {project.architecture}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 2.5 — WHAT CONNECTS MY WORK */}
      <section className="border-b border-border-subtle/50 py-20 px-6 md:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Label + Thesis */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">THE PATTERN</span>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight">
                What connects my work
              </h2>
              <p className="text-sm text-text-muted leading-relaxed font-sans font-medium max-w-md">
                Every product I build solves the same root problem — humans carry too much in their heads. Businesses run on remembered rules, informal coordination, and cognitive overhead that compounds until it breaks.
              </p>
              <div className="border-l-2 border-accent/50 pl-4 py-1">
                <p className="text-sm font-mono text-foreground font-semibold leading-relaxed">
                  The best software doesn&rsquo;t add features. It removes the need to remember things.
                </p>
              </div>
            </div>

            {/* Right: Project-to-thesis mapping */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  product: "ShipClawFast",
                  removes: "Setup memory",
                  detail: "Developers shouldn&rsquo;t have to remember how to configure a dev environment. The system does.",
                  href: "https://www.shipclawfast.com/",
                },
                {
                  product: "MenuOS",
                  removes: "Operational coordination memory",
                  detail: "Restaurants shouldn&rsquo;t run on shouted orders and shift-change briefings. The system tracks everything.",
                  href: "/work/menuos",
                },
                {
                  product: "TEM",
                  removes: "Expense recording memory",
                  detail: "Freelancers and operators shouldn&rsquo;t struggle to reconstruct spending history. The system captures and recalls expenses via voice.",
                  href: "https://tem-nu.vercel.app/",
                },
                {
                  product: "Household OS",
                  removes: "Wealth coordination memory",
                  detail: "An exploration into modeling shared household finances as a coordination problem rather than a budgeting problem.",
                  href: "https://private-wealth-app.vercel.app/",
                },
              ].map((item) => (
                <a
                  key={item.product}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="flex items-start gap-6 p-5 rounded-xl border border-border-subtle/50 bg-card-bg/25 hover:border-accent/30 transition-colors group"
                >
                  <div className="shrink-0 min-w-[120px]">
                    <span className="font-mono text-[10px] text-accent font-bold uppercase tracking-wider block">PRODUCT</span>
                    <span className="font-heading text-sm font-bold text-foreground mt-0.5 block group-hover:text-accent transition-colors">{item.product}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="font-mono text-[10px] text-text-muted font-semibold uppercase tracking-wider">REMOVES</span>
                    <p className="text-sm font-semibold text-foreground">{item.removes}</p>
                    <p className="text-xs text-text-muted leading-relaxed font-sans" dangerouslySetInnerHTML={{ __html: item.detail }} />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-text-muted group-hover:text-accent shrink-0 mt-1 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — SYSTEMS THINKING */}
      <section className="border-b border-border-subtle/50 py-20 px-6 md:px-8 bg-background relative overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">CORE ARCHITECTURAL IDEAS</span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight mt-1">How I Think</h2>
          </div>
          <HowIThink />
        </div>
      </section>

      {/* SECTION 5 — SYSTEM MAP */}
      <section id="system-map-section" className="border-b border-border-subtle/50 py-20 px-6 md:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-left">
            <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">LIVING CONCEPT COGNITION GRAPH</span>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight mt-1">System Map</h2>
            <p className="text-sm text-text-muted max-w-xl mt-2 leading-relaxed">
              An interactive visual map charting the connections between artificial intelligence, reinforcement learning, database structures, human-centered UI, and tooling.
            </p>
          </div>
          <SystemMap />
        </div>
      </section>

      {/* SECTION 4 — BUILD LOGS */}
      <section className="border-b border-border-subtle/50 py-20 px-6 md:px-8 bg-background">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">WEEKLY WRITE-UPS & TELEMETRY</span>
              <h2 className="font-heading text-3xl font-extrabold tracking-tight mt-1">Recent Build Logs</h2>
            </div>
            <Link
              href="/writing"
              className="inline-flex items-center gap-1.5 text-sm font-mono text-text-muted hover:text-accent font-semibold transition-colors group"
            >
              <span>ARCHIVE CHRONICLES</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="glass-interactive rounded-2xl p-6 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-accent mb-4">
                    <span>{post.category.toUpperCase()}</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold tracking-tight text-foreground group-hover:text-accent transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-text-muted font-medium mt-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground/80 mt-6 pt-4 border-t border-border-subtle/30 font-mono group-hover:text-accent transition-colors">
                  <span>VIEW ENTRY</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — CONTACT */}
      <section className="py-24 px-6 md:px-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-7xl space-y-6 relative z-10 text-left">
          <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">GET IN TOUCH</span>
          <h2 className="font-heading text-4xl font-extrabold tracking-tight">Let&rsquo;s build stable software.</h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-lg font-sans font-medium">
            Collaborating with founders, product teams, and builders on local-first database replication, queue coordination systems, and reliable workflows.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="mailto:shashankatthaluri@gmail.com"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-dim transition-all shadow-[0_0_20px_rgba(224,106,59,0.1)]"
            >
              <span>Email Shashank</span>
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-2 px-6 py-3 rounded-lg border border-border-subtle hover:border-accent/40 bg-card-bg/40 text-foreground transition-all"
            >
              <span>Secure Coordinates</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
