export const contactInfo = {
  name: "Mohammad Shoeb",
  email: "shoebmohd13@gmail.com",
  githubUrl: "https://github.com/MohdShoeb13",
  linkedinUrl: "https://linkedin.com/in/mohd-shoeb",
  location: "New Delhi, India",
  resumeUrl: "/assets/mohammad-shoeb-resume.pdf",
};

export const bio =
  "Senior Java and Agentic AI engineer with 7+ years building event-driven systems for global financial institutions, and the agent tooling that now modernizes them.";

/** The hero line under the name. */
export const heroLede =
  "Agentic AI engineer and senior Java developer. I build multi-agent systems, and the secure enterprise software they run on.";

/** The opening statement, revealed word by word on scroll. */
export const statement =
  "Seven years of building Java systems for banks and asset managers taught me one habit: software earns trust when someone can check it. I bring that habit to AI agents. Loops with a limit. Answers with a source. Gates a person can read.";

export interface FactItem {
  label: string;
  value: string;
}

export const quickFacts: FactItem[] = [
  { label: "Now", value: "Senior Software Engineer at EPAM Systems, building agentic tooling with Claude Code and MCP." },
  { label: "Before", value: "Publicis Sapient for Wellington Management, and Capgemini for Mitsubishi UFJ Financial Group." },
  { label: "Based in", value: "New Delhi, India. M.Tech in Software Systems from BITS Pilani." },
];

export interface MetricItem {
  number: string;
  label: string;
  source: string;
}

export const metricsData: MetricItem[] = [
  {
    number: "40%",
    label: "Less time writing boilerplate, after the team adopted multi-agent tooling",
    source: "EPAM Systems",
  },
  {
    number: "40+",
    label: "Critical and high CVEs resolved through Snyk security gates",
    source: "EPAM Systems",
  },
  {
    number: "35%",
    label: "Fewer authentication support incidents after the move to OAuth 2.0 and JWT",
    source: "EPAM Systems",
  },
  {
    number: "99.9%",
    label: "Uptime across six production applications on AWS",
    source: "Publicis Sapient, for Wellington Management",
  },
  {
    number: "3 days to 4 hours",
    label: "Setup time for a new financial instrument",
    source: "Publicis Sapient, for Wellington Management",
  },
  {
    number: "60%",
    label: "Faster outage detection across 20+ monitored services",
    source: "Publicis Sapient, for Wellington Management",
  },
];

export const tickerTechnologies = [
  "Java 21",
  "Spring Boot",
  "Kafka",
  "LangGraph",
  "Claude Code",
  "MCP",
  "RAG",
  "FastAPI",
  "React",
  "TypeScript",
  "Python",
  "AWS",
  "Kubernetes",
  "OAuth 2.0",
];

export interface ProjectFlowStep {
  index: string;
  title: string;
  detail: string;
}

/**
 * How a project's agents are wired, used to shape the 3D graph:
 * - router: a hub dispatches each request to one specialist
 * - pipeline: steps run in a fixed sequence
 * - loop: a sequence with one bounded return edge (see flow.loop)
 */
export type ProjectTopology = "router" | "pipeline" | "loop";

export interface ProjectItem {
  id: string;
  accent: "coral" | "mint" | "cyan" | "lilac" | "amber";
  topology: ProjectTopology;
  category: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  liveNote?: string;
  /** Set for employer work with no public repo or demo. */
  affiliation?: string;
  privateNote?: string;
  agentsCount: string;
  flow: {
    entry: string;
    transport: string;
    router: string;
    label: string;
    nodes: ProjectFlowStep[];
    foundation: string;
    /** For "loop" topology: the bounded return edge, as 0-based indexes into nodes. */
    loop?: { from: number; to: number; label: string };
  };
  notes: {
    heading: string;
    points: { title: string; desc: string }[];
    readmeUrl?: string;
  };
}

export const projectsData: ProjectItem[] = [
  {
    id: "security-agent",
    accent: "coral",
    topology: "loop",
    category: "Security remediation · EPAM",
    title: "Security Remediation Agent",
    tagline: "From a vulnerable dependency to a reviewable patch.",
    description:
      "Pick a finding in a Java repository. The agent checks it against the real dependency graph, picks a supported upgrade, builds a candidate patch, repairs what the upgrade breaks, and runs the validation gates. A human reviews the result. Each stage is verified against real sandbox output; joining them into one automated run is still in progress.",
    stack: ["Java 21", "Spring Boot 4", "LangChain4j", "Angular", "PostgreSQL", "OSV", "Docker sandbox"],
    affiliation: "EPAM project",
    privateNote: "Built at EPAM. The source and demo are private.",
    agentsCount: "10 gates · 2 await publishing",
    flow: {
      entry: "Dependency scan report",
      transport: "Ingestion · normalized findings",
      router: "Run state machine · bounded repair loop",
      label: "Sequential run · a failed gate can return to repair",
      nodes: [
        { index: "01", title: "Verify graph", detail: "Resolved, not requested, versions" },
        { index: "02", title: "Plan upgrade", detail: "Pick a supported fix" },
        { index: "03", title: "Patch", detail: "Deterministic version bump" },
        { index: "04", title: "Diagnose failure", detail: "Classify against baseline" },
        { index: "05", title: "Model repair", detail: "Smallest source change" },
        { index: "06", title: "Validation gates", detail: "Build, tests, security" },
      ],
      foundation: "Isolated worker sandbox · SHA-256 evidence chain · human review",
      loop: { from: 5, to: 3, label: "A failed gate goes back to diagnosis, within budget" },
    },
    notes: {
      heading: "Architecture notes for the Security Remediation Agent",
      points: [
        {
          title: "Bounded repair.",
          desc: "When an upgrade breaks the build, the failure is classified against the baseline, a model proposes the smallest source change, and a policy allows edits to main source only. A budget caps the attempts.",
        },
        {
          title: "Real isolation.",
          desc: "Untrusted builds run in a worker container with a read-only root, no credentials, and no network route except an allowlisting dependency proxy. Every artifact is hashed on the way out and re-checked before it is read.",
        },
        {
          title: "Honest scope.",
          desc: "Ten validation gates cover resolution, build, tests, smoke checks, security and diff scope. Gates that do not apply are stored as not applicable, never shown as passed. No run has yet gone end to end without a person launching each stage, and GitHub publishing is not built.",
        },
      ],
    },
  },
  {
    id: "fin-expert",
    accent: "mint",
    topology: "router",
    category: "Financial education",
    title: "Fin Expert",
    tagline: "Clarity for every money question.",
    description:
      "Six specialized agents bring cited financial education, portfolio analytics, market context and goal projections into one conversational workspace.",
    stack: ["React", "FastAPI", "LangGraph", "FAISS", "MCP"],
    githubUrl: "https://github.com/MohdShoeb13/fin-expert",
    liveUrl: "https://fin-expert-two.vercel.app",
    agentsCount: "6 specialist agents",
    flow: {
      entry: "React workspace",
      transport: "REST API",
      router: "LangGraph · query router",
      label: "Routes to one of six specialists",
      nodes: [
        { index: "01", title: "Finance Q&A", detail: "Cited knowledge retrieval" },
        { index: "02", title: "Portfolio", detail: "Allocation & risk" },
        { index: "03", title: "Market", detail: "Quotes & trends" },
        { index: "04", title: "Goals", detail: "Growth projections" },
        { index: "05", title: "News", detail: "Headline synthesis" },
        { index: "06", title: "Tax", detail: "Tax-focused retrieval" },
      ],
      foundation: "FAISS + MiniLM retrieval · SQLite session memory",
    },
    notes: {
      heading: "Architecture notes for Fin Expert",
      points: [
        {
          title: "Grounded education.",
          desc: "Finance Q&A and tax answers retrieve from a 50-article knowledge base. Educational disclaimers keep the scope explicit: no personalized investment advice.",
        },
        {
          title: "Resilient data access.",
          desc: "Market data follows fresh cache → yFinance → Alpha Vantage → flagged stale cache → clear error.",
        },
        {
          title: "Beyond the browser.",
          desc: "A stdio MCP server exposes quotes, portfolio analysis, knowledge search and goal projections to Claude Desktop.",
        },
      ],
      readmeUrl: "https://github.com/MohdShoeb13/fin-expert#readme",
    },
  },
  {
    id: "resonant",
    accent: "cyan",
    topology: "pipeline",
    category: "Call intelligence",
    title: "Resonant",
    tagline: "Every insight, back to the call.",
    description:
      "Support recordings and transcripts become evidence-linked summaries, quality scores and next steps, with a workspace that connects each finding to its source.",
    stack: ["React", "FastAPI", "LangGraph", "Whisper", "SQLite"],
    githubUrl: "https://github.com/MohdShoeb13/call_summarizer_agents",
    liveUrl: "https://call-summarizer-rnc7.onrender.com",
    liveNote: "Hosted on a free tier that sleeps. The first load can take up to a minute to wake.",
    agentsCount: "Evidence-linked outputs",
    flow: {
      entry: "Audio or transcript",
      transport: "Upload API · status polling",
      router: "LangGraph · conditional pipeline",
      label: "Sequential processing · transcription only for audio",
      nodes: [
        { index: "01", title: "Intake", detail: "Validate & normalize" },
        { index: "02", title: "Transcription", detail: "Audio inputs only" },
        { index: "03", title: "Summarization", detail: "Findings + evidence IDs" },
        { index: "04", title: "Quality scoring", detail: "Four scored dimensions" },
      ],
      foundation: "Provider retries + fallback · SQLite result history",
    },
    notes: {
      heading: "Architecture notes for Resonant",
      points: [
        {
          title: "Traceable findings.",
          desc: "Evidence chips focus the source transcript segment. Scored dimensions must cite valid evidence IDs; unknown speaker identity can leave a dimension unscorable.",
        },
        {
          title: "Bounded execution.",
          desc: "A two-worker executor accepts eight queued jobs. Saturation returns HTTP 429; interrupted work is not silently rerun after a restart.",
        },
        {
          title: "Honest scope.",
          desc: "Whisper transcribes audio here; it does not identify speakers or assess vocal tone. Curated sample replays are explicitly labeled. This is a local, single-user prototype.",
        },
      ],
      readmeUrl: "https://github.com/MohdShoeb13/call_summarizer_agents#readme",
    },
  },
  {
    id: "email-assistant",
    accent: "lilac",
    topology: "loop",
    category: "Writing assistant",
    title: "Email Assistant",
    tagline: "Your intent. Your voice. Reviewed.",
    description:
      "Seven cooperating agents turn a short request into an editable email, with a checkable tone contract, a visible review loop and memory of your writing edits.",
    stack: ["React", "FastAPI", "LangGraph", "SSE", "Pydantic"],
    githubUrl: "https://github.com/MohdShoeb13/email_assistant",
    liveUrl: "https://email-assistant-alpha-gray.vercel.app",
    agentsCount: "7 cooperating agents",
    flow: {
      entry: "Request + writing profile",
      transport: "FastAPI · live SSE events",
      router: "LangGraph · seven-agent workflow",
      label: "Sequential workflow · review can return to the writer",
      nodes: [
        { index: "01", title: "Input parser", detail: "Recipient & constraints" },
        { index: "02", title: "Intent detection", detail: "Classify the request" },
        { index: "03", title: "Tone stylist", detail: "Checkable style rules" },
        { index: "04", title: "Personalization", detail: "Profile & past edits" },
        { index: "05", title: "Draft writer", detail: "Compose or revise" },
        { index: "06", title: "Review & validator", detail: "Check tone & facts" },
        { index: "07", title: "Routing & memory", detail: "Set status & save" },
      ],
      foundation: "Review → writer · max 2 revisions, then human review",
      loop: { from: 5, to: 4, label: "Review returns to the writer, at most twice" },
    },
    notes: {
      heading: "Architecture notes for Email Assistant",
      points: [
        {
          title: "A bounded feedback loop.",
          desc: "Review can send a draft back to the writer twice. Unresolved issues return with a needs_review status instead of disappearing behind an endless retry.",
        },
        {
          title: "Learning from edits.",
          desc: "Saving an edited draft records the original, edited version and diff. The tone stylist uses the last three edits as evidence of the user’s style.",
        },
        {
          title: "Visible model routing.",
          desc: "All model calls go through an Anthropic/OpenAI router with quality and cost profiles. SSE exposes progress, fallback attempts, drafts and revisions.",
        },
      ],
      readmeUrl: "https://github.com/MohdShoeb13/email_assistant#readme",
    },
  },
  {
    id: "content-blitz",
    accent: "amber",
    topology: "router",
    category: "Content marketing",
    title: "ContentBlitz",
    tagline: "One brief. The right specialist.",
    description:
      "A routed content workspace for sourced research, content plans, SEO articles, LinkedIn posts and marketing images, with streamed responses and session memory.",
    stack: ["React", "FastAPI", "LangGraph", "SSE", "SQLite"],
    githubUrl: "https://github.com/MohdShoeb13/content-blitz",
    liveUrl: "https://content-blitz.vercel.app",
    agentsCount: "5 specialist agents",
    flow: {
      entry: "Chat · research · content · image",
      transport: "REST + token-streaming SSE",
      router: "LangGraph · query handler",
      label: "Routes to one of five specialists",
      nodes: [
        { index: "01", title: "Deep research", detail: "Web search + sources" },
        { index: "02", title: "Content strategist", detail: "Structured content plan" },
        { index: "03", title: "SEO blog writer", detail: "Draft + SEO scoring" },
        { index: "04", title: "LinkedIn writer", detail: "Post + social checks" },
        { index: "05", title: "Image generator", detail: "Prompt + image providers" },
      ],
      foundation: "Provider-agnostic LLM registry · SQLite checkpoints",
    },
    notes: {
      heading: "Architecture notes for ContentBlitz",
      points: [
        {
          title: "Routing, not a fixed assembly line.",
          desc: "The query handler selects one specialized agent per request. LLM classification falls back to keyword routing when unavailable.",
        },
        {
          title: "Deterministic checks.",
          desc: "SEO scoring and hashtag/length analysis complement generated copy. Research uses web providers to produce sourced briefs.",
        },
        {
          title: "Explicit fallback paths.",
          desc: "Images follow DALL-E → Stability → a local placeholder. Streaming transport failures fall back to REST; research can fall back to a caveated model-knowledge answer.",
        },
      ],
      readmeUrl: "https://github.com/MohdShoeb13/content-blitz#readme",
    },
  },
];

export interface ExperienceRole {
  company: string;
  /** The end client, where the work was done for one. */
  client?: string;
  period: string;
  location: string;
  title: string;
  /** A short note under the title, such as promotions. */
  note?: string;
  highlights: string[];
}

export const experienceData: ExperienceRole[] = [
  {
    company: "EPAM Systems",
    period: "Feb 2024 to now",
    location: "Gurugram, remote",
    title: "Senior Software Engineer, Java and Agentic AI",
    highlights: [
      "Built an agentic Java 8 to Java 21 migration system with Claude Code and MCP servers. Agents run dependency analysis, refactoring, build updates and regression validation.",
      "Led the move from legacy session tokens to OAuth 2.0 and JWT across 8+ services. It removed session-fixation vulnerabilities and cut authentication support incidents by 35%.",
      "Built the Nginx (njs) gateway that validates JWTs, and cut over with zero downtime.",
      "Moved 12+ CI/CD pipelines to GitHub Actions: 30% more reliable, 18 minutes off each build. Snyk gates resolved 40+ critical and high CVEs and halved security review time.",
      "Built multi-agent developer tooling and drove team adoption. Boilerplate time fell 40% and test scaffolding became twice as fast.",
    ],
  },
  {
    company: "Publicis Sapient",
    client: "Wellington Management",
    period: "Sep 2021 to Jan 2024",
    location: "Gurugram",
    title: "Associate Technology, Java Full Stack",
    highlights: [
      "Designed decoupled microservices on Apache Kafka for event-driven processing of derivatives trading data.",
      "Built six greenfield applications with Spring Boot and React on AWS, holding 99.9% uptime in production.",
      "Built a live health dashboard for 20+ services that cut mean time to detect an outage by 60%.",
      "Built a data-driven React framework for instrument setup. Configuration time fell from 3 days to under 4 hours.",
    ],
  },
  {
    company: "Capgemini",
    client: "Mitsubishi UFJ Financial Group",
    period: "Jun 2019 to Sep 2021",
    location: "Pune",
    title: "Software Engineer, Java Full Stack",
    note: "Promoted twice: Senior Software Engineer in 2020, Associate Consultant in 2021.",
    highlights: [
      "Extended the Fenergo client-lifecycle platform with 50+ field configurations and validation rules, covering 15+ onboarding jurisdictions in APAC and EMEA.",
      "Built trade-finance screens in Angular: eight product workflows that process 500+ transactions a month.",
      "Managed lookup tables and validation for 30+ regulated data entities, with zero data-quality incidents in production.",
    ],
  },
];

export interface SecondaryWorkItem {
  title: string;
  badge: string;
  description: string;
  stack: string[];
}

export const secondaryWorkData: SecondaryWorkItem[] = [
  {
    title: "Nginx JWT gateway",
    badge: "EPAM, private",
    description:
      "One gateway in front of 8+ services. It validates JWTs, introspects tokens and enforces sessions, so each service stops carrying its own auth code. Cut over with zero downtime.",
    stack: ["Nginx njs", "OAuth 2.0", "JWT"],
  },
  {
    title: "JARVIS, a second brain",
    badge: "Personal, private",
    description:
      "A knowledge base that compiles each source into a linked wiki once, then answers from it. Python tools lint it, grade its retrieval and flag when a habit starts to drift. The career facts on this page were checked against it.",
    stack: ["Obsidian", "Python", "Claude Code", "React", "Electron"],
  },
];

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategoriesData: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["Java 8 to 21", "Python", "TypeScript", "JavaScript", "SQL"],
  },
  {
    title: "Backend and data",
    skills: ["Spring Boot", "REST APIs", "Microservices", "Apache Kafka", "FastAPI", "PostgreSQL", "MongoDB"],
  },
  {
    title: "Agentic AI",
    skills: ["Claude Code", "Model Context Protocol", "LangGraph", "LangChain", "LLM tool calling", "RAG with FAISS"],
  },
  {
    title: "Cloud and delivery",
    skills: ["AWS", "Docker", "Kubernetes", "GitHub Actions", "Jenkins"],
  },
  {
    title: "Security",
    skills: ["OAuth 2.0", "OpenID Connect", "JWT", "Nginx njs", "Snyk"],
  },
  {
    title: "Frontend",
    skills: ["React", "Angular"],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export const educationData: EducationItem[] = [
  {
    degree: "M.Tech, Software Systems",
    institution: "BITS Pilani",
    period: "2020 to 2022",
  },
  {
    degree: "B.Tech, Mechanical Engineering",
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    period: "2013 to 2017",
  },
];

export type CertificationProvider = "Anthropic" | "OpenAI" | "Google" | "AWS" | "Oracle" | "GitHub";

export interface CertificationGroup {
  provider: CertificationProvider;
  providerFull: string;
  titles: string[];
}

export const certificationsData: CertificationGroup[] = [
  {
    provider: "Anthropic",
    providerFull: "Anthropic",
    titles: ["Claude Certified Architect, Professional", "Claude Certified Architect"],
  },
  {
    provider: "OpenAI",
    providerFull: "OpenAI",
    titles: ["Technical Practitioner", "Codex Solutions Practitioner", "Cyber Solutions Practitioner"],
  },
  {
    provider: "Google",
    providerFull: "Google",
    titles: ["Certified Partner Specialist, Gemini Enterprise Agent Development"],
  },
  {
    provider: "AWS",
    providerFull: "Amazon Web Services",
    titles: ["AWS Certified Developer, Associate"],
  },
  {
    provider: "Oracle",
    providerFull: "Oracle",
    titles: ["Oracle Certified Associate, Java SE 8 Programmer"],
  },
  {
    provider: "GitHub",
    providerFull: "GitHub",
    titles: ["GitHub Actions"],
  },
];

export const certificationCount = certificationsData.reduce((n, g) => n + g.titles.length, 0);

export interface MigrationStage {
  title: string;
  detail: string;
}

/** The four agent stages of the Java migration system, in run order. */
export const migrationStages: MigrationStage[] = [
  { title: "Dependency analysis", detail: "Finds what the service depends on and what the upgrade touches." },
  { title: "Refactoring", detail: "Rewrites old APIs and patterns in current Java." },
  { title: "Build updates", detail: "Brings the build configuration up to the new version." },
  { title: "Regression validation", detail: "Runs the tests to confirm the behaviour has not changed." },
];

/** The four beats of the opening story. Each is split where the two sides meet. */
export const storyBeats: { left: string; right: string }[] = [
  { left: "Every system", right: "has two sides." },
  { left: "Most engineers", right: "pick one." },
  { left: "I work across", right: "the line." },
  { left: "I build", right: "both sides." },
];

/** Screenshots of the live projects, by project id. */
export const projectShots: Record<string, string> = {
  "fin-expert": "/assets/previews/fin-expert.jpg",
  "email-assistant": "/assets/previews/email-assistant.jpg",
  "content-blitz": "/assets/previews/content-blitz.jpg",
};

export interface BackSystem {
  /** A short service-style name, shown in mono. */
  name: string;
  title: string;
  detail: string;
  where: string;
  stack: string[];
  /** The one crate the press stamps "legendary": gold tape, a glow and sparks. */
  legendary?: boolean;
}

/** The back side: systems that run behind the screens. */
export const backSystems: BackSystem[] = [
  {
    name: "trade-events",
    title: "Event-driven trading data",
    detail: "Decoupled microservices on Apache Kafka for derivatives trading data.",
    where: "Publicis Sapient, for Wellington Management",
    stack: ["Kafka", "Spring Boot", "AWS"],
  },
  {
    name: "auth-gateway",
    title: "One gateway for sign-in",
    detail: "OAuth 2.0 and JWT across 8+ services behind one Nginx gateway. Cut over with zero downtime.",
    where: "EPAM Systems",
    stack: ["Nginx njs", "OAuth 2.0", "JWT"],
  },
  {
    name: "java-migration",
    title: "Java 8 to 21, run by agents",
    detail: "Agents handle dependency analysis, refactoring, build updates and regression validation.",
    where: "EPAM Systems",
    stack: ["Claude Code", "MCP", "Java 21"],
    legendary: true,
  },
  {
    name: "ci-pipelines",
    title: "Faster, safer delivery",
    detail: "12+ pipelines on GitHub Actions, 18 minutes off each build. Snyk gates closed 40+ CVEs.",
    where: "EPAM Systems",
    stack: ["GitHub Actions", "Snyk"],
  },
  {
    name: "health-monitor",
    title: "Outages found sooner",
    detail: "A live dashboard over 20+ services that cut the time to detect an outage by 60%.",
    where: "Publicis Sapient, for Wellington Management",
    stack: ["React", "CloudWatch"],
  },
  {
    name: "onboarding-rules",
    title: "Rules for regulated onboarding",
    detail: "50+ field configurations and validation rules across 15+ jurisdictions on Fenergo.",
    where: "Capgemini, for Mitsubishi UFJ Financial Group",
    stack: ["Fenergo", "SQL"],
  },
];

export interface WorkKind {
  title: string;
  detail: string;
  stack: string[];
  built: string[];
}

/** The kinds of work to bring. The chosen one pre-fills the email subject. */
export const workKinds: WorkKind[] = [
  {
    title: "Agent systems",
    detail: "Multi-agent workflows with loops that have a limit, answers that cite a source, and gates a person can read.",
    stack: ["LangGraph", "Claude Code", "MCP", "RAG"],
    built: ["Fin Expert", "Email Assistant", "Security Remediation Agent"],
  },
  {
    title: "Java platforms",
    detail: "Event-driven services for regulated work, built to stay up and easy to change.",
    stack: ["Java 21", "Spring Boot", "Kafka", "AWS"],
    built: ["Trading data services", "Six applications on AWS", "Java 8 to 21 migration"],
  },
  {
    title: "Security and delivery",
    detail: "Sign-in that holds, pipelines that are quick, and security checks that run on every change.",
    stack: ["OAuth 2.0", "JWT", "GitHub Actions", "Snyk"],
    built: ["Nginx JWT gateway", "12+ CI/CD pipelines", "40+ CVEs resolved"],
  },
  {
    title: "Front ends",
    detail: "Data-heavy screens in React and Angular that turn days of setup into hours.",
    stack: ["React", "Angular", "TypeScript"],
    built: ["Instrument setup framework", "Trade-finance screens", "Health dashboard"],
  },
];

/** The page's sections, in order, for the side index. */
export const pageSections = [
  { id: "top", label: "Both sides" },
  { id: "work", label: "The front" },
  { id: "systems", label: "The back" },
  { id: "profile", label: "Profile" },
  { id: "choose", label: "Choose" },
  { id: "contact", label: "Contact" },
];
