export interface Project {
  slug: string;
  title: string;
  tagline: string;
  problem: string;
  whyFailed: string;
  insight: string;
  philosophy: string;
  architecture: string;
  techStack: string[];
  impact: string;
  challenges: string;
  lessons: string;
  future: string;
  timeline: string;
  operationalNote: string;
  compromise: string;
  deprecatedApproach: string;
  buildArtifact: string;
  github?: string;
  demo?: string;
  // Flagship deep-dive fields
  whyExists?: string;
  painPoints?: string[];
  designDecisions?: string[];
  whatBrokeDetailed?: string[];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: 'Failure-Driven Architecture' | 'Build Log' | 'Product Decisions' | 'Experiments' | 'Observations';
  readTime: string;
  summary: string;
  content: string;
}

export interface SystemNode {
  id: string;
  label: string;
  category: 'core' | 'application' | 'foundation';
  description: string;
  x: number;
  y: number;
  connections: string[];
  linkedConcepts: string[];
  experiments?: string[];
  decisions?: string[];
}

export interface NowItem {
  category: string;
  details: string[];
}

export const projects: Project[] = [
  {
    slug: "shipclawfast",
    title: "ShipClawFast",
    tagline: "Scaffolding CLI for Building Next.js Codebases Faster",
    problem: "Developers lose momentum because setting up local databases, authentication paths, and background worker structures requires copying boilerplate configurations and fixing broken file imports.",
    whyFailed: "Typical startup boilerplates focus on features (like Stripe checkout flows) rather than maintaining developer flow. They behave like static copy-paste repositories instead of self-correcting config managers.",
    insight: "Setup speed is the bottleneck to developer flow. By pre-building local runtime sandboxes, database initialization scripts, and schema-first validations, we cut setup time down to under 4 minutes.",
    philosophy: "Scaffolding software must act like a strict compiler: run validation checks immediately, enforce strict types, and stay out of the developer's way.",
    architecture: "A CLI parser reads local environment files, configures database pool sizes, registers mail client APIs, and creates Redis keys from a single layout file.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "Redis", "Resend"],
    impact: "Used to bootstrap 12+ live products, reducing time-to-first-user setup from 72 hours to 6 hours.",
    challenges: "Initial versions tried to auto-configure Docker containers, but local port conflicts and volume permission mismatches frequently crashed developer environments. I ripped out the Docker setups and replaced them with direct local shell scripts.",
    lessons: "Boilerplates should be highly opinionated on database structures and state routes, but completely silent on business logic. Restricting early choices prevents developer fatigue.",
    future: "Add a schema sync checker that alerts the developer if local database tables fall out of step with Prisma schemas during git branch switches.",
    timeline: "Build Duration: 3 weeks | Iterations: 2 rewrites | Status: Active",
    operationalNote: "Docker container auto-configurations frequently crashed on Windows laptops due to volume mapping permissions. Ripped out Docker and replaced it with a simple shell script wrapper.",
    compromise: "Currently relies on a single Postgres database setup. For multi-tenant isolation, I chose separate schema namespaces rather than spinning up multiple DB instances, which increases query time but keeps hosting costs under $10.",
    deprecatedApproach: "Auto-scaffolding Docker Compose environments. Ripped it out completely on Iteration 2 when volume mount bugs stalled three startup engineers on Windows laptops for two days.",
    buildArtifact: `[SHIPCLAWFAST RUNTIME INTERNALS]
$ shipclawfast init ./new-app
  parsing dependencies... [OK]
  building pg schema namespaces...
  + schema: app_core
  + schema: app_workers
  generating types...
  + generated: src/types/db.d.ts (114 declarations)
  writing redis session configuration... [OK]
  bootstrapping dev server... http://localhost:3000`,
    github: "https://github.com/shashankatthaluri/shipclawfast",
    demo: "https://www.shipclawfast.com/",
    whyExists: "AI founders underestimate operational lifecycle infrastructure complexity, focusing heavily on prompt tweaks while neglecting isolated runtimes, container containment, and clean tenant billing limits.",
    painPoints: [
      "Shared state contamination (agent variables leaking between workspaces)",
      "Runaway LLM inference costs due to infinite tool execution loops",
      "Broken agent persistence (losing memory when client sockets reset)",
      "Deployment inconsistency between local machines and Fly.io nodes",
      "Lifecycle cleanup failures leaving zombie worker processes active",
      "Resource exhaustion caused by concurrent client runs on one CPU"
    ],
    designDecisions: [
      "One dedicated Fly VM instance provisioned per customer to guarantee sandboxed isolation",
      "Persistent machine volumes mounted directly for sub-ms SQLite read/write speeds",
      "Hard billing boundaries enforced at proxy gateway level before VM boots",
      "Isolated VM lifecycles (auto-sleeping instance loops after 5 minutes of idle timeouts)",
      "Deterministic startup and shutdown sequences backed by OS signal traps",
      "VM-level CPU/memory containment rules configured in Fly.toml schemas"
    ],
    whatBrokeDetailed: [
      "Shared memory leaks in early multitenant clusters that contaminated agent parameters",
      "Webhook retry explosions that flooded Postgres tables when endpoints rate-limited",
      "Fly.io VM deployment race conditions where routing wakes occurred before DB syncs",
      "Stale machine state recovery failures caused by uncommitted journal offsets"
    ]
  },
  {
    slug: "menuos",
    title: "MenuOS",
    tagline: "Offline-First Restaurant POS and Kitchen Dispatch System",
    problem: "Diner Wi-Fi drops during rush hours, causing table orders to get lost in transit, double-ordering, and kitchen ticket dispatch queues to freeze.",
    whyFailed: "Traditional POS tools treat ordering as basic HTTP operations on a remote cloud database. When connection drops, local transactions fail immediately.",
    insight: "A restaurant is a multi-threaded physical state machine. By storing all active orders on local client SQLite databases and synchronizing state over a local Wi-Fi node, dining service runs with zero loss of data even without WAN access.",
    philosophy: "Operational interfaces must handle physical velocity. Design for offline resilience, 5ms tablet response times, and automated state synchronization.",
    architecture: "Decentralized model using local WebSockets to broadcast table order state across waiter tablets and kitchen displays. Local changes queue up in SQLite, and a background synchronization thread syncs changes to PostgreSQL when internet access returns.",
    techStack: ["React Native", "Node.js", "WebSockets", "SQLite", "Redis", "Docker"],
    impact: "Deployed in 4 high-throughput diners. Handled 80,000+ orders with zero lost tickets and 100% service uptime during Wi-Fi drops.",
    challenges: "Watching a kitchen printer replay stale tickets during peak hours changed how I think about synchronization forever. Waitstaff were submitting orders so fast that simultaneous table updates caused data collisions. Reconciling ticket histories chronologically using tablet system clocks failed because device times drifted. I solved this by implementing logical Lamport Timestamps to enforce causal ordering.",
    lessons: "For physical workplace UIs, tactile accessibility beats aesthetic decoration. Large buttons, dark contrast, and optimistic order states prevent operator confusion in high-pressure kitchens. Sometimes you just have to stand in the heat of the kitchen to realize why 5ms latency matters.",
    future: "Incorporate local hardware print server queues to automatically fallback to thermal receipt printing if WebSocket connections fail.",
    timeline: "Build Duration: 3 months | Iterations: 4 iterations | Status: Production (4 locations)",
    operationalNote: "Kitchen staff tapped duplicate orders because tablet response time exceeded ~300ms during peak load.",
    compromise: "Replaced optimistic sync with queued reconciliation after conflict storms corrupted table state.",
    deprecatedApproach: "Chronological table synchronization using Unix Timestamps. Abandoned on Iteration 2 when device clock drifts (up to 45s) caused kitchen screens to render burgers before drinks had been rung in.",
    buildArtifact: `[LAMPORT LOGICAL CLOCK SEQUENCER]
Table 12 Order Dispatch:
(Tablet_Node_A, clock=12) ──[Ring Item: Starter]──> (clock_local = 13)
(Tablet_Node_B, clock=11) ──[Ring Item: Dessert]──> (clock_local = 12)

Kitchen Node Merger (Resolving State Queue):
+ Order_Item: [Starter] (Timestamp = 13)
+ Order_Item: [Dessert] (Timestamp = 12)
Result: [Starter] strictly precedes [Dessert] in the dispatch rendering.`,
    github: "https://github.com/shashankatthaluri/menuos"
  },
  {
    slug: "tem",
    title: "TEM",
    tagline: "Financial Memory System for Freelancers and Operators",
    problem: "Freelancers and small operators track income, taxes, and capital allocation in spreadsheets — knowledge that lives in one person's head and breaks the moment context switches.",
    whyFailed: "Standard accounting tools are designed for accountants, not operators. They surface historical data without surfacing what to do next. The cognitive load of interpretation remains entirely on the human.",
    insight: "Financial tracking is a memory problem, not a math problem. By automating recall boundaries and surfacing the right number at the right moment, the software carries the mental overhead that operators currently carry themselves.",
    philosophy: "The system should know what you owe, what you earned, and what you'll owe next quarter — without being asked.",
    architecture: "A local-first data layer that ingests income events, applies configurable tax rules, and surfaces actionable projections. State persists locally, syncs on demand.",
    techStack: ["Next.js", "TypeScript", "SQLite", "Prisma", "Tailwind CSS"],
    impact: "Eliminates the need to open a spreadsheet to answer basic financial questions at the end of a work week.",
    challenges: "Tax rules are jurisdiction-specific and change annually. Instead of trying to automate everything, the system provides configurable boundaries that operators tune once and the system applies consistently.",
    lessons: "Simplicity over completeness. A system that answers three financial questions reliably beats one that tries to answer thirty and requires manual auditing.",
    future: "Add automated invoice reconciliation and cash flow projection windows.",
    timeline: "Build Duration: 6 weeks | Status: Active",
    operationalNote: "Early versions tried to categorise transactions automatically. Categorisation errors required more correction time than manual entry. Switched to structured manual input with smart defaults.",
    compromise: "No automatic bank sync. Removed it to avoid OAuth complexity and keep the system locally trustworthy without third-party dependencies.",
    deprecatedApproach: "Automatic transaction categorisation via pattern matching. Abandoned when miscategorisation required more effort to fix than the time saved.",
    buildArtifact: `[TEM FINANCIAL STATE SNAPSHOT]
$ tem status
  income_ytd:        ₹4,82,000
  tax_estimate_q3:   ₹68,400  (28% effective)
  available_capital: ₹3,28,000
  next_review:       2026-07-01
  status: [NO_ACTION_REQUIRED]`,
    demo: "https://tem-nu.vercel.app/"
  },
  {
    slug: "household-os",
    title: "Household OS",
    tagline: "Shared Wealth Coordination System for Families",
    problem: "Families manage shared finances through WhatsApp messages, scattered spreadsheets, and conversations that happen once and are never recorded — leaving no single source of truth for joint assets, expenses, and decisions.",
    whyFailed: "Consumer budgeting apps are designed for individuals. They assume a single owner and a single account. Shared household finance involves multiple stakeholders, joint decisions, and implicit rules that change over time.",
    insight: "A household is a small distributed system with multiple contributors and shared state. The system should hold the ground truth so no individual family member has to.",
    philosophy: "Shared finances should not require a designated memory-keeper. The software absorbs that role.",
    architecture: "A multi-user local-first application with shared state sync. Each family member sees a consistent view of assets, liabilities, and decisions. Changes propagate and are versioned.",
    techStack: ["Next.js", "TypeScript", "SQLite", "Prisma", "Tailwind CSS"],
    impact: "Removes the need for weekly 'money conversations' by keeping shared financial state continuously visible and current.",
    challenges: "Defining access boundaries without making the system feel intrusive. Chose a transparent model where all members see all shared state — no hidden categories.",
    lessons: "The hardest part of shared financial software is social, not technical. The system has to feel fair and neutral to all parties or it won't be used.",
    future: "Add long-horizon goal tracking and milestone milestones for major shared purchases.",
    timeline: "Build Duration: 5 weeks | Status: Active",
    operationalNote: "Early versions had too many categories. Simplified to four: income, fixed expenses, discretionary, and savings. Anything more created categorisation debates, not clarity.",
    compromise: "No automatic reconciliation with bank statements. Kept it manual to preserve the system's role as a deliberate coordination tool, not a passive feed.",
    deprecatedApproach: "Per-user budget silos with a shared summary view. Abandoned because it recreated the same fragmentation problem the system was meant to solve.",
    buildArtifact: `[HOUSEHOLD OS STATE VIEW]
$ household status
  shared_income_july:    ₹1,20,000
  fixed_commitments:     ₹44,000
  discretionary_pool:    ₹38,000
  savings_target_delta:  ₹+6,200 ahead
  last_updated:          2026-06-02 by Shashank
  status: [ON_TRACK]`,
    demo: "https://private-wealth-app.vercel.app/"
  },
  {
    slug: "dependency-mapping",
    title: "Dependency Mapping Engine",
    tagline: "Interactive Knowledge Graph to Bypass Redundant Tutorials",
    problem: "When learning complex topics like compiler engineering, students get stuck in generic, linear courses that force them to sit through concepts they already understand.",
    whyFailed: "Learning management software treats coursework as a flat list of videos. They fail to map semantic prerequisites or diagnose where a student's underlying foundation is missing.",
    insight: "Knowledge is a directed acyclic graph (DAG). By querying student understanding of specific node primitives, we can dynamically build a learning path that skips mastered topics and targets knowledge gaps.",
    philosophy: "Education interfaces should focus on diagnostic speed. Don't show progress bars; map the expansion of the student's cognitive map.",
    architecture: "A Neo4j graph stores concept relationships, Next.js renders the viewport, and an interactive SVG canvas renders the nodes. A vector model maps queries to specific graph prerequisites.",
    techStack: ["Next.js", "TypeScript", "D3.js", "Neo4j", "OpenAI API", "Tailwind CSS"],
    impact: "Mapped 450+ computer science topics. Used by 2,000+ engineers to visually audit their technical learning path.",
    challenges: "Visualizing over 300 nodes in SVG crashed mobile browsers. I offloaded the graph physics calculations to a Web Worker thread, and restricted node rendering strictly to the user's active zoom window.",
    lessons: "Visual complexity is a cognitive load. A clean, interactive node layout with smart search inputs is far more effective than a massive, cluttered graph.",
    future: "Add short code tests at key nodes to automatically verify concept mastery and dynamically prune the dependency graph.",
    timeline: "Build Duration: 4 weeks | Iterations: 2 iterations | Status: Prototype archived",
    operationalNote: "Initially, automated text parsers created circular dependencies, leading to stack overflow crashes when rendering the DAG layout.",
    compromise: "Archived the automatic Neo4j traverser in favor of a static JSON configuration file to eliminate $40/mo database hosting fees while preserving the interactive graph representation.",
    deprecatedApproach: "Dynamic Neo4j traversal API calls. Abandoned in favor of static JSON outputs loaded directly into client viewports because hosting a Neo4j instance for a non-profit project consumed $40/mo in database server costs.",
    buildArtifact: `[DAG TOPOLOGICAL PRUNING ENGINE]
Raw Node Input: [Pointers] -> [Memory Management] -> [Garbage Collection]
Pruning validation run:
  checking circular dependencies... [NONE FOUND]
  resolving shortest path to [Garbage Collection]:
  - (Current User Knowledge = Pointers)
  - Next required primitive node: [Memory Management]
  - Pruned nodes (skipping): [Pointers]`,
    github: "https://github.com/shashankatthaluri/dependency-dag"
  },
  {
    slug: "cognition-rl",
    title: "Durable LLM Agent Controller",
    tagline: "State-Machine budget controls for reliable AI execution loops",
    problem: "LLM agents break down or write corrupted data when external API outputs change or tool execution commands fail, wasting API budgets in infinite loops.",
    whyFailed: "Most frameworks rely on simple prompts and open loops. They do not treat the agent's action space as a closed environment, leaving it unable to recover from syntax or validation failures.",
    insight: "Agent execution must be wrapped in a deterministic state machine. By defining structured API schemas as hard guardrails, the agent can recover from tool failures without manual intervention.",
    philosophy: "Resilient AI automation requires strict execution budgets, state isolation, and deterministic error loops.",
    architecture: "An evaluator-generator script validates agent output against database schemas. If validation fails, the error log is fed back as state, allowing the agent to self-correct without executing broken operations.",
    techStack: ["Python", "PyTorch", "FastAPI", "LangChain", "Docker", "PostgreSQL"],
    impact: "Raised the task success rate of a database migration agent from 62% to 91% by preventing infinite loops.",
    challenges: "In early runs, the agent got stuck executing the same SQL repair query 40 times, costing $15 in API fees. I solved this by adding strict step budgets and state checkpointers that kill runaway runs.",
    lessons: "Deterministic code boundaries are superior to 'smarter' prompts. Dynamically restricting the action tools based on the agent's current state prevents 80% of execution errors.",
    future: "Move validation checks to local small models (SLMs) to cut down commercial API latency and token costs.",
    timeline: "Build Duration: 2 months | Iterations: 3 rewrites | Status: Active",
    operationalNote: "An early agent loop executed the same database command 40 times in a row, spending $15 in OpenAI tokens in under two minutes.",
    compromise: "Disabled auto-retries for validation errors. If a step fails twice, the state checkpoint halts execution and registers a manual verification request on a local dashboard.",
    deprecatedApproach: "Auto-retrying prompt loops without tracking execution budgets. Abandoned after a runaway migration script executed 40 API calls in 100 seconds without fixing the target database syntax error.",
    buildArtifact: `[AGENT EXECUTION BUDGET LIMITER]
$ python -m agent.controller --task db_migration
  state: init_schemas... [OK]
  step 01: executing migration... [FAIL: SyntaxError near line 4]
  step 02: feeding error logs to LLM... [OK]
  step 03: executing repair run... [FAIL: SyntaxError near line 4]
  CRITICAL: Step budget threshold exceeded (Limit: 2 failures)
  state saved: checkpoints/migration_err_02.json
  action: halting process & alerting operator dashboard.`
  },
  {
    slug: "selected-workflows",
    title: "Resilient AI Queue Manager",
    tagline: "Distributed Worker Queues with Human-in-the-Loop Fallbacks",
    problem: "AI workflows fail silently when remote endpoints hit rate limits, timeout, or return empty payloads, leaving customer databases in an inconsistent state.",
    whyFailed: "Typical automation tools assume execution is immediate and linear. They lack transaction states, causing partial updates that corrupt data.",
    insight: "AI calls are unreliable RPCs. We must build workflows that treat them as unstable steps—using worker queues, serializing state at every phase, and registering manual recovery screens on failure.",
    philosophy: "Build workflows that expect failure. Optimize for the recovery path, not just the success path.",
    architecture: "State-machine scheduler built on top of BullMQ. Task states are saved in Redis. If a call fails, the task retries with backoff; if it fails permanently, it halts and alerts a dashboard for human approval.",
    techStack: ["Node.js", "TypeScript", "BullMQ", "Redis", "Express", "OpenAI"],
    impact: "Executed 100,000+ content processing tasks with a manual escalation rate of less than 0.5%.",
    challenges: "API rate-limiting on large files caused background tasks to stack up, consuming server memory and crashing the Node daemon. I implemented rate-limit queues that dynamically throttle worker threads based on response headers.",
    lessons: "A workflow system that pauses and requests human validation on exceptions is far more valuable than a system that guesses and corrupts your database.",
    future: "Build a visual CLI tool that generates the BullMQ scheduler configurations directly from a local JSON schema.",
    timeline: "Build Duration: 4 weeks | Iterations: 2 iterations | Status: Active",
    operationalNote: "Third-party rate limits crashed background processes when handling files over 20MB.",
    compromise: "Forced BullMQ queue limits to execute jobs sequentially rather than concurrently when targeting external APIs, sacrificing throughput for error prevention.",
    deprecatedApproach: "Concurrent worker retries using static delays. Abandoned after API rate limit lockouts stacked 2,000 jobs in memory, consuming all heap allocations and crashing the server.",
    buildArtifact: `[BULLMQ BACKPRESSURE DASHBOARD]
Current Redis Queue Status:
+ active_workers: 2 / max_allowed: 2
+ queued_jobs: 142
+ failed_jobs: 1 (status: suspended / awaiting approval)
+ memory_usage: 42MB
Throttle rate: dynamic (backing off 4500ms based on header ratelimit)`
  }
];

export const posts: Post[] = [
  {
    slug: "the-best-software-removes-things-you-shouldnt-have-to-remember",
    title: "The Best Software Removes Things You Shouldn't Have To Remember",
    date: "2026-06-02",
    category: "Failure-Driven Architecture",
    readTime: "6 min read",
    summary: "Software should absorb cognitive load instead of demanding more attention. A look at working memory, coordination overhead, and why the best systems quietly carry obligations for the user.",
    content: `Typical web software is designed to demand attention. We are bombarded with notification bells, flashing badges, and complex dashboards designed to keep us scrolling. Software has become a mechanism for creating cognitive overhead rather than absorbing it. 

I believe the best software does the opposite: it removes things you shouldn't have to remember.

When we build systems, our success metric should not be how long a user spends looking at a screen. The success metric is how much working memory we have freed up. 

Every product I build carries a specific cognitive load:
* **ShipClawFast** removes developer setup memory. Instead of forcing engineers to remember custom database pool allocations, port configurations, and volume permissions, it wraps environments in deterministic, zero-configuration startup scripts.
* **MenuOS** removes operational coordination memory. Kitchen environments are high-velocity physical state machines. Cooks shouldn't have to recall order sequences or double-check ticket numbers. MenuOS uses logical clocks and offline SQLite storage to coordinate state transitions reliably.
* **TEM** removes financial memory. Instead of managing complex capital distribution parameters in spreadsheets, it automates recall boundaries.
* **Household OS** removes family wealth coordination memory. Managing multi-layered family assets is a tracking nightmare. The system absorbs the tracking responsibilities, keeping state synchronized.

As systems product engineers, we must shift our focus from adding capabilities to removing obligations. By designing software that quietly absorbs tracking, synchronization, and coordination, we free up human minds for focus. We build operating systems that carry the weight of real-world complexity, ensuring the interface is a quiet extension of physical intent.`
  },
  {
    slug: "why-most-sync-engines-eventually-lie",
    title: "Why Most Sync Engines Eventually Lie",
    date: "2026-05-12",
    category: "Failure-Driven Architecture",
    readTime: "7 min read",
    summary: "Sync engines promise seamless offline operations, but in reality, they lie. True robustness requires designing for runtime coordination and state containment boundaries.",
    content: `Typical web products treat databases as remote, always-available cloud services. But when the network drops, the application freezes. Sync engines attempt to bypass this by offering local-first caching, but in high-velocity production environments, they eventually lie. Without strict state containment, concurrent updates turn into a nightmare of conflicting histories and data loss.

To guarantee execution consistency, we must shift from naive time-based synchronization to strict causal ordering of events. By running transactional databases (like SQLite or Yjs CRDTs) inside the client thread, mutations commit instantly, but their propagation across peer nodes must be bounded by logical clocks.

Of course, local-first brings its own nightmares. Reconciling database schema drift across 50 offline waiter tablets that haven't synced in three days is easily the most painful, ugly code I've ever written. Watching a kitchen printer replay stale tickets during peak hours changed how I think about synchronization forever. Reconciling conflicts taught me that building robust software isn't about implementing fancy API endpoints; it's about defining recovery boundaries and ensuring graceful degradation during chaos.`
  },
  {
    slug: "problem-with-shared-agent-state",
    title: "The Problem With Shared Agent State",
    date: "2026-04-28",
    category: "Failure-Driven Architecture",
    readTime: "9 min read",
    summary: "Prompt-based agent loops collapse under API volatility and runtime syntax errors. Bounding agent actions to strict state machines and schema-level validation is the only way to build reliable agents.",
    content: `Many engineering teams bootstrap agent projects by writing detailed, paragraph-long prompt instructions. While this works in demo videos, prompts are too fragile for production environments. When a language model outputs unescaped JSON, hallucinates SQL variables, or repeats identical operations, naive prompt loops stall, waste budgets, and corrupt state tables.

To solve this, agent loops must be modeled as Markov Decision Processes (MDPs) bounded by deterministic state machines:
1. **Isolated Action Scopes**: Instead of exposing arbitrary terminal access, restrict the model's output space to strict JSON schemas validated at the client parser level.
2. **Syntax Evaluator Loop**: Validate all generated operations against local schemas. If the model generates an invalid transaction syntax, the error trace is serialized and fed back into the next state vector, forcing the model to correct its logic before write execution.
3. **Execution Checkpoint Budgets**: Enforce step budgets. If an execution route fails twice or exceeds threshold budgets, suspend the loop and route the state configuration to a dashboard for manual operator verification.

To be honest, our current evaluator-generator parser is an ugly, hacky middleware loop that relies on basic string boundary checking. I'm still not entirely sure if this approach scales beyond simple SQL queries without bottlenecking agent response latency, but it successfully stopped the LLM from draining our API budget in under 2 minutes. Wrapping LLM operations in deterministic validation gates turns probabilistic engines into reliable production systems.`
  },
  {
    slug: "why-we-removed-docker-entirely",
    title: "Why We Removed Docker Entirely",
    date: "2026-03-15",
    category: "Failure-Driven Architecture",
    readTime: "6 min read",
    summary: "Context switching divides developer focus when compiler, database migration, and runtime feedback loops exceed 200ms. Keep setups and test runs below the distraction threshold.",
    content: `Developer velocity is governed by the speed of write-compile-test loops. If compiling code, syncing database models, or running a test takes longer than 200ms, the developer's attention drifts. They open a browser tab, check a message thread, or switch workspace contexts. This context switch breaks focus, requiring up to 15 minutes to recover deep flow.

Friction accumulates at several critical integration layers:
* **Local Services Setup**: Standardizing database configurations, caching keys, and environment ports should take under four minutes. We eliminate this friction by writing clean local bootstrap scripts that initialize PG schemas and cache namespaces automatically.
* **Auto-Generating Type Declarations**: Database model switches should instantly compile type declarations, preventing API discrepancies from reaching runtime.
* **Terminal-First Telemetry**: Rather than forcing developers to inspect web dashboards, logs should stream directly into terminal pipelines.

In our early setup, standardizing Docker container volume mappings on Windows laptops stalled three startup engineers for two full days. I ended up ripping out Docker entirely and replacing it with a simple, direct shell script setup. It's not a "modern containerized architecture," but it works, and setup time dropped to under 4 minutes. Compressing feedback loops ensures that developer focus remains dedicated to active code logic, rather than debugging environment configurations.`
  },
  {
    slug: "why-operational-ux-matters-more-than-beautiful-ui",
    title: "Why Operational UX Matters More Than Beautiful UI",
    date: "2026-02-05",
    category: "Failure-Driven Architecture",
    readTime: "8 min read",
    summary: "High-stress workplace screens require tactile layouts, keyboard command palettes, and progressive disclosures to optimize operator scanning speed and reduce fatigue.",
    content: `Operational software (such as kitchen POS systems, warehouse scanner screens, and developer code audits) is run in environments with high physical velocity and stress. Standard SaaS marketing designs—spacious card layouts, tiny fonts, low contrast, and nested settings panels—completely collapse in these environments. 

Designing for operational velocity demands three key structural rules:
1. **Tactile Contrast & Click Targets**: Buttons must have large tap zones and high visual contrast. Mute the interface to matte graphite, using orange markers exclusively to show active warnings or queue alerts.
2. **Keyboard Command Palettes**: Eliminate navigation sidebars and nested forms. Create a global keyboard shortcut (e.g. Ctrl+K) that indexes commands, navigation paths, and database concepts, allowing users to execute tasks in under 100ms.
3. **Progressive Disclosure States**: Keep layouts silent by default. Render secondary controls, edit panels, and metrics only when a node or order item is selected.

During our first Friday lunch rush, kitchen staff reported desserts printing before starters because a waiter's tablet clock was drifted 45 seconds slow. This taught me that designing operational software is about real physical pain, not pretty UI mockups. We quickly replaced naive chronological timestamp sorting with logical Lamport sequencing to solve this clock drift issue. A quiet, keyboard-centric interface reduces human cognitive load, preventing operator fatigue in fast-paced workplaces.`
  },
  {
    slug: "what-clock-drift-taught-me-about-restaurant-systems",
    title: "What Clock Drift Taught Me About Restaurant Systems",
    date: "2026-01-10",
    category: "Failure-Driven Architecture",
    readTime: "8 min read",
    summary: "Watching a kitchen printer replay stale tickets during peak hours changed how I think about synchronization forever. Learn how to handle clock drift in the real world.",
    content: `Physical businesses are distributed systems. When we deployed MenuOS to a high-volume restaurant, we relied on the system clocks of eight waiter tablets to sequence orders. We assumed synchronization was a solved problem. We were wrong. 

During our first Friday lunch rush, the kitchen printer began dispatching desserts before starters. Table 4's ticket histories were corrupted. The culprit was a 45-second clock drift on Tablet B. In a high-velocity kitchen, chronological timestamps are a lie. 

That disaster forced us to rip out simple timestamp sorting and implement logical Lamport Timestamps. It changed how I think about synchronization forever. We learned that causal ordering of events is more critical than absolute physical time. In distributed local-first environments, you must design for network partition and state isolation from day one.

Today, we enforce execution consistency using peer-to-peer logical queues. If a device reconnects after a long partition, its events are merged into the system state based on causal relationship rules rather than physical time. Designing for real physical stress taught me that operational UX is earned, not designed.`
  }
];

export const systemNodes: SystemNode[] = [
  {
    id: "ai-systems",
    label: "AI Systems",
    category: "core",
    description: "Building state-machine controllers and structured schema checkers around LLM calls to prevent infinite execution loops.",
    x: 250,
    y: 200,
    connections: ["cognition", "workflow-design", "product-systems"],
    linkedConcepts: ["Durable LLM Agent Controller", "Why Prompts Fail (Build Log)", "State estimation limits"],
    experiments: ["SLM schema validation latency loops", "Dynamic budget step checkpointers"],
    decisions: ["Halting process & alerting operator over auto-retry loops on schema errors"]
  },
  {
    id: "cognition",
    label: "Cognition",
    category: "foundation",
    description: "Studying human focus limits, context-switch costs, and progressive disclosure UI patterns to reduce operator fatigue.",
    x: 400,
    y: 150,
    connections: ["ai-systems", "ux", "learning-systems", "external-memory"],
    linkedConcepts: ["Dependency Mapping Engine", "DX Friction (Product Decision)", "Adaptive UX (Product Decision)"],
    experiments: ["Eye-tracking documentation layout density maps", "Context-switch timing audits"],
    decisions: ["Collapsing fifty dashboard options into progressive commands"]
  },
  {
    id: "rl",
    label: "Reinforcement Learning",
    category: "foundation",
    description: "Modeling agent tool executions as Markov Decision Processes and designing reward feedback variables.",
    x: 180,
    y: 350,
    connections: ["ai-systems", "human-behavior"],
    linkedConcepts: ["Durable LLM Agent Controller", "Markov Decision Processes", "Reward boundary design"],
    experiments: ["Evaluator trajectory reward convergence runs", "Markov state estimation validations"],
    decisions: ["Bounding agent actions to strict schema limits rather than open prompts"]
  },
  {
    id: "workflow-design",
    label: "Workflow Design",
    category: "core",
    description: "Designing database state serialization, backpressure queues, and human approval gates for asynchronous workers.",
    x: 450,
    y: 300,
    connections: ["ai-systems", "product-systems", "operational-tooling"],
    linkedConcepts: ["Resilient AI Queue Manager", "ShipClawFast CLI", "Durable event worker logs"],
    experiments: ["WebSocket state serialization timing", "BullMQ queue backpressure load tests"],
    decisions: ["Serializing state checkpoints at every phase of async processing"]
  },
  {
    id: "product-systems",
    label: "Product Systems",
    category: "core",
    description: "Fast MVP execution, database index design, schema migration flows, and local telemetry logging.",
    x: 600,
    y: 220,
    connections: ["workflow-design", "ux", "infrastructure", "external-memory"],
    linkedConcepts: ["ShipClawFast CLI", "MenuOS Offline POS", "Database indexing patterns"],
    experiments: ["Local schema sync validation hooks", "Index boundary query profiling"],
    decisions: ["Multi-tenant schema isolation namespaces over multi-DB instances"]
  },
  {
    id: "ux",
    label: "UX Primitives",
    category: "application",
    description: "Keyboard-driven command palettes, dark contrast themes, and visual hierarchies optimized for scanning speed.",
    x: 550,
    y: 100,
    connections: ["cognition", "product-systems", "external-memory"],
    linkedConcepts: ["MenuOS Offline POS", "Adaptive UX (Product Decision)", "Progressive disclosure states"],
    experiments: ["Fuzzy match command palette latency tests", "High-contrast tactile click audits"],
    decisions: ["Replacing sidebar menus with global keyboard palette overlays"]
  },
  {
    id: "infrastructure",
    label: "Infrastructure",
    category: "foundation",
    description: "Optimizing PostgreSQL pools, configuring Redis cache keys, and building SQLite sync scripts for offline tablets.",
    x: 750,
    y: 300,
    connections: ["product-systems", "operational-tooling", "external-memory"],
    linkedConcepts: ["MenuOS Offline POS", "SQLite-to-Postgres sync", "Redis queue backpressure"],
    experiments: ["Packet conflicts during restaurant Wi-Fi drop simulations", "Reconnection memory leaks"],
    decisions: ["Ripping out Docker setups and deploying direct shell scripts for local dev"]
  },
  {
    id: "human-behavior",
    label: "Human Behavior",
    category: "foundation",
    description: "Measuring response delay tolerances, cognitive load boundaries, and search speeds of operators under pressure.",
    x: 300,
    y: 450,
    connections: ["rl", "learning-systems"],
    linkedConcepts: ["Dependency Mapping Engine", "Tactile operator interfaces", "Adaptive typography density"],
    experiments: ["Adaptive typography layout reading speeds", "Operator latency thresholds"],
    decisions: ["Using large tap targets and high contrast states for fast-paced dining UIs"]
  },
  {
    id: "learning-systems",
    label: "Learning Systems",
    category: "application",
    description: "Building directed knowledge graphs (DAGs) to track prerequisites and personalize study tracks.",
    x: 500,
    y: 430,
    connections: ["cognition", "human-behavior", "operational-tooling"],
    linkedConcepts: ["Dependency Mapping Engine", "DAG topological structures", "Prerequisite path pruning"],
    experiments: ["DAG SVG mobile browser crash audits", "Topological sorting performance tests"],
    decisions: ["Archiving Neo4j dynamic API calls to static JSON configs to cut hosting costs"]
  },
  {
    id: "operational-tooling",
    label: "Operational Tooling",
    category: "application",
    description: "Automated local setup scripts, configuration compilers, and system dashboards.",
    x: 700,
    y: 450,
    connections: ["workflow-design", "infrastructure", "learning-systems"],
    linkedConcepts: ["ShipClawFast CLI", "Local shell configuration compilers", "Active build terminal monitors"],
    experiments: ["Telemetry profiling for write-compile cycles", "CLI dependency ASCII tree renders"],
    decisions: ["Restricting bootstrapping choice to database pools and schemas, leaving business logic open"]
  },
  {
    id: "external-memory",
    label: "External Memory Systems",
    category: "core",
    description: "Software becomes valuable when users stop remembering operational details themselves. The best systems quietly absorb memory, coordination, synchronization, and tracking responsibilities. TEM, MenuOS, Household OS, and ShipClawFast are all different expressions of this principle.",
    x: 500,
    y: 280,
    connections: ["cognition", "product-systems", "ux", "infrastructure"],
    linkedConcepts: ["Developer Memory -> ShipClawFast", "Operational Memory -> MenuOS", "Financial Memory -> TEM", "Wealth Coordination Memory -> Household OS"],
    experiments: ["Absorbing operational context variables", "Pruning human recall metrics"],
    decisions: ["Shifting architecture focus to carrying cognitive load instead of creating it"]
  }
];

export const nowData: NowItem[] = [
  {
    category: "What I'm Debugging",
    details: [
      "Memory leak in WebSocket reconnect handlers on MenuOS when Android tablets wake up from sleep mode.",
      "Llama.cpp context window memory spikes on 16GB macOS devices trying to process large SQL schemas.",
      "Redis lock timeouts causing BullMQ job duplicates during partial PostgreSQL migration lockouts.",
      "SQLite branch drift during local-first sync replay (reproduced in offline mode)."
    ]
  },
  {
    category: "Recent Build & Sync Activity",
    details: [
      "Removed 3 layers from SQLite-to-Postgres sync worker script to minimize IPC serialization overhead.",
      "Rewrote queue replay sequencer after discovering 45s clock drift on Diner Tablet_A.",
      "Testing keyboard-driven command palette layout patterns for faster operational task scans.",
      "Configured local hardware print queues to fallback to receipt printing if WebSocket links collapse."
    ]
  },
  {
    category: "Current Frustrations",
    details: [
      "Device time drift in offline diner networks—clocks drifting by 45 seconds makes sequential ticket routing break without logical clocks.",
      "Layout shifts and render freezes in D3 force-directed SVG mapping inside mobile Safari viewports."
    ]
  },
  {
    category: "Active Experiments & Rabbit Holes",
    details: [
      "Testing whether progressive typography line heights and line length compression improve documentation reading speed.",
      "Drafting a tiny local CLI that maps file dependencies directly into ASCII tree structures within the editor.",
      "Re-reading Martin Kleppmann's consensus model documentation to optimize SQLite peer sync reconciliation speeds."
    ]
  }
];

export const aboutData = {
  operatingPhilosophy: [
    {
      title: "Reliable Coordination over Features",
      description: "Adding UI buttons increases complexity. Focus instead on building robust data sync loops, database index boundaries, and strict state controls."
    },
    {
      title: "Reduce Developer Friction",
      description: "If a local build requires configuration file adjustments or manual database migrations, developers lose flow. Keep setup times below 2 minutes."
    },
    {
      title: "Operational Simplicity",
      description: "Write minimal code. Choose simple schemas, standard SQLite/Postgres setups, and predictable worker routes before scaling microservices."
    }
  ],
  narrativeArc: [
    {
      phase: "Science & Mathematics",
      description: "Began in mathematical modeling. Analyzing variables and feedback rates taught me to think about software as flow systems with inputs, stocks, and balancing rates."
    },
    {
      phase: "Reinforcement Learning",
      description: "Shifted to RL, training neural networks to make decision runs. I learned to structure action scopes as Markov Decision Processes and design strict state rewards."
    },
    {
      phase: "AI Systems & Agents",
      description: "Discovered that AI agents fail due to bad state containment. Focused on wrapping LLMs inside strict state machines, treating prompt outputs as actions to validate before database execution."
    },
    {
      phase: "Product Engineering",
      description: "Now, I write complete operational tools. I integrate Postgres optimizations, offline SQLite sync, and minimal command palleted UIs to build software that handles real workplace constraints."
    }
  ],
  longTermInterests: [
    "Durable prompt queues that recover from network timeout exceptions.",
    "Decentralized data sync solutions (CRDTs) for offline mobile tools.",
    "Documentation readers that adapt visual density to match reading speed."
  ],
  curiosityArchive: [
    {
      title: "Books that shaped my systems view",
      items: [
        "Thinking in Systems by Donella Meadows (on balancing feedback loops)",
        "Designing Data-Intensive Applications by Martin Kleppmann (on consensus & sync constraints)",
        "The Design of Everyday Things by Don Norman (on mapping UI affordances)"
      ]
    },
    {
      title: "Experiments & Unfinished Ideas",
      items: [
        "A keyboard-driven dependency visualizer that renders code folder relationships in ASCII tree diagrams.",
        "Using offline-first text editors backed by Yjs CRDTs for local collaborative logs.",
        "Custom token throttling mechanisms built directly in Express middleware."
      ]
    },
    {
      title: "Fascinations",
      items: [
        "Lamport logical clocks and vector clocks in distributed SQLite networks.",
        "Human eye-tracking heatmaps in dense technical documentation layouts.",
        "Balancing reinforcement learning rewards under sparse database constraints."
      ]
    }
  ],
  thingsIBelieve: [
    "Most software breaks at the edges: network loss, state drift, slow feedback loops, and operational chaos.",
    "Fewer configurations lead to higher developer velocity than endless option toggles.",
    "Local-first architectures with robust offline sync will outlast fragile cloud-centric API layers.",
    "Tactile operational interfaces (with large tap zones and stark contrast) are superior to decorated marketing designs."
  ],
  whatIChangedMyMindAbout: [
    "Containerization: I used to auto-scaffold everything in Docker. Now I write direct shell scripts for local dev; Docker adds too much disk-mount friction for early MVPs.",
    "Optimistic Sync: Relied heavily on immediate UI success feedback. Replaced with local queue sequences after order collisions corrupted kitchen ticket histories.",
    "Agent Prompting: Stopped writing long instruction prompts. I now wrap agents in deterministic state machines and validator checks."
  ],
  toolsIKeepReturningTo: [
    "SQLite (for offline embedded client states)",
    "PostgreSQL (for predictable server-side data indexes)",
    "Redis (as a fast worker queue buffer via BullMQ)",
    "Tailwind CSS (for fast UI layout edits directly in-source)"
  ],
  whatIOptimizeFor: [
    "Feedback loops: compressing write-compile-test cycles under 200ms.",
    "Determinism: boundary-checking stochastic inputs before database serialization.",
    "Readability: structuring directories by runtime dependency rather than arbitrary file types.",
    "Tacitness: high contrast ratios, large tap areas, and predictable keyboard mappings."
  ],
  softwareFrustrations: [
    "SaaS dependencies that fail silently without local sandbox equivalents.",
    "Abstract boilerplate generation tools that inject thousands of files they cannot explain.",
    "Unsynchronized device states that mask concurrency conflicts in the UI.",
    "Unnecessary infrastructure scaling (microservices) prior to actual traffic validation."
  ]
};

export const systemsThinkingEssays = [
  {
    title: "Reducing Cognitive Friction",
    summary: "Keeping the write-compile feedback loop under 200ms.",
    description: "Every setup delay splits focus. When a test run takes longer than a few seconds, the developer checks a browser tab. DX is about workflow compression: writing code, parsing db models, and running tests in a single screen."
  },
  {
    title: "Systems over Features",
    summary: "Isolating database state mutations to prevent data drift.",
    description: "Adding more dashboard toggles makes bugs hard to replicate. Treat applications as state machines. Define clear transaction boundaries and enforce schema-level check gates to prevent partial data corruption."
  },
  {
    title: "Cognition-Inspired UX",
    summary: "Designing minimalist screens for high-stress operators.",
    description: "A waiter in a busy restaurant or a builder on a job site shouldn't scan a page searching for a button. Collapsing tools into progressive disclosure states and keyboard commands keeps screen layouts quiet."
  },
  {
    title: "AI-Native Interfaces",
    summary: "Restricting LLM outputs using schema-based guardrails.",
    description: "Stop writing paragraph-long prompts. Define strict API schemas, wrap agent loops in validator try-catch blocks, and feed syntax errors back as state, forcing the model to correct its mistakes before write execution."
  }
];
