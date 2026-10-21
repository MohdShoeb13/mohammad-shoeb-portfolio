export const contactInfo = {
  name: "Mohammad Shoeb",
  email: "shoebmohd13@gmail.com",
  githubUrl: "https://github.com/MohdShoeb13",
  linkedinUrl: "https://linkedin.com/in/mohd-shoeb",
  location: "New Delhi, India",
  resumeUrl: "/assets/mohammad-shoeb-resume.pdf",
};

export const bio =
  "Senior Java and Agentic AI engineer with 6+ years of experience building enterprise systems and multi-agent pipelines.";

export interface MetricItem {
  number: string;
  label: string;
  source: string;
}

export const metricsData: MetricItem[] = [
  {
    number: "40%",
    label: "Less boilerplate authoring time",
    source: "EPAM developer tooling",
  },
  {
    number: "2×",
    label: "Faster test scaffolding",
    source: "EPAM developer tooling",
  },
  {
    number: "40+",
    label: "Critical/high CVEs resolved",
    source: "EPAM security gates",
  },
  {
    number: "99.9%",
    label: "Uptime across production services",
    source: "Publicis Sapient",
  },
];

export const tickerTechnologies = [
  "LangGraph",
  "FastAPI",
  "React",
  "Spring Boot",
  "Kafka",
  "MCP",
  "RAG",
  "Java 21",
  "Python",
  "TypeScript",
  "Docker",
  "Kubernetes",
  "AWS",
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
  period: string;
  title: string;
  highlights: string[];
  details: string;
}

export const experienceData: ExperienceRole[] = [
  {
    company: "EPAM Systems",
    period: "Feb 2024–Present",
    title: "Senior Software Engineer, Agentic AI & Java Full Stack",
    highlights: [
      "Built agentic migration workflows and multi-agent developer tooling.",
      "Modernized OAuth 2.0/JWT authentication across 8+ services.",
    ],
    details:
      "Designed an Nginx njs gateway. Migrated 12+ CI/CD pipelines, with a 30% reliability gain and 18 minutes off build time.",
  },
  {
    company: "Publicis Sapient",
    period: "Sep 2021–Feb 2024",
    title: "Associate Technology, Java Full Stack",
    highlights: [
      "Built Kafka-based financial systems for derivatives trading data.",
      "Delivered six React/Spring Boot applications on AWS.",
    ],
    details:
      "Reduced instrument setup from 3 days to under 4 hours. Monitored 20+ services and lowered mean time to detection by 60%.",
  },
  {
    company: "Capgemini",
    period: "Jun 2019–Sep 2021",
    title: "Software Engineer, Java Full Stack",
    highlights: [
      "Extended Fenergo financial onboarding workflows.",
      "Built Angular trade-finance screens and product workflows.",
    ],
    details:
      "Delivered 50+ field configurations across 15+ jurisdictions, and eight workflows handling 500+ trade transactions per month.",
  },
];

export interface SecondaryWorkItem {
  title: string;
  badge: string;
  description: string;
}

export const secondaryWorkData: SecondaryWorkItem[] = [
  {
    title: "Nginx JWT Gateway",
    badge: "Enterprise work",
    description:
      "JWT validation, token introspection and session enforcement, with a zero-downtime cutover.",
  },
];

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategoriesData: SkillCategory[] = [
  {
    title: "Agentic systems",
    skills: ["LangGraph", "LangChain", "MCP", "RAG", "LLM tool calling", "LoRA/QLoRA"],
  },
  {
    title: "Enterprise software",
    skills: ["Java 8–21", "Spring Boot", "Kafka", "React", "Angular", "Python"],
  },
  {
    title: "Delivery & trust",
    skills: ["AWS", "GitHub Actions", "Docker", "Kubernetes", "OAuth 2.0/JWT", "Snyk"],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export const educationData: EducationItem[] = [
  {
    degree: "M.Tech Software Systems",
    institution: "BITS Pilani",
    period: "Jul 2020–Jul 2022",
  },
  {
    degree: "B.Tech Mechanical Engineering",
    institution: "Dr. A.P.J. Abdul Kalam Technical University",
    period: "Jul 2013–Jul 2017",
  },
];

export interface CertificationItem {
  title: string;
  provider: "Google" | "Nvidia" | "Anthropic" | "OpenAI" | "AWS" | "Oracle" | "GitHub";
  providerFull: string;
}

export const certificationsData: CertificationItem[] = [
  {
    title: "Certified Partner Specialist, Gemini Enterprise Agent Development",
    provider: "Google",
    providerFull: "Google",
  },
  {
    title: "Nvidia Certified Gen AI LLM Associate",
    provider: "Nvidia",
    providerFull: "Nvidia",
  },
  {
    title: "Claude Certified Architect",
    provider: "Anthropic",
    providerFull: "Anthropic",
  },
  {
    title: "OpenAI Technical Practitioner",
    provider: "OpenAI",
    providerFull: "OpenAI",
  },
  {
    title: "Codex Solutions Practitioner",
    provider: "OpenAI",
    providerFull: "OpenAI",
  },
  {
    title: "AWS Certified Developer – Associate",
    provider: "AWS",
    providerFull: "Amazon Web Services",
  },
  {
    title: "Oracle Certified Associate, Java SE 8 Programmer",
    provider: "Oracle",
    providerFull: "Oracle",
  },
  {
    title: "GitHub Actions Certification",
    provider: "GitHub",
    providerFull: "GitHub",
  },
];
