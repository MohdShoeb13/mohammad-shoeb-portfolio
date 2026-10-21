import { useEffect, useRef, useState } from "react";
import { Copy, Check, Terminal, Download, ExternalLink, X } from "lucide-react";
import { bio, contactInfo, projectsData, skillCategoriesData } from "@/data/portfolio-data";

type CopyState = "idle" | "copied" | "failed";

const greeting = [
  `${contactInfo.name} portfolio interactive shell v1.1`,
  "Type 'help' to see available commands.",
];

// Every answer comes from the data file, so the shell never drifts from the page.
const commands: Record<string, () => string[]> = {
  help: () => ["Available commands: bio, skills, projects, contact, resume, clear, exit"],
  bio: () => [bio],
  skills: () => skillCategoriesData.map((c) => `${c.title}: ${c.skills.join(", ")}`),
  projects: () => projectsData.map((p, i) => `${i + 1}. ${p.title} (${p.category})`),
  contact: () => [`Email: ${contactInfo.email}`, `Location: ${contactInfo.location}`],
};

export const ContactSection = () => {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [termOpen, setTermOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [termLogs, setTermLogs] = useState<string[]>(greeting);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const openedByUser = useRef(false);

  // Focus moves into the shell only after the visitor opens it, and back to the
  // toggle when they close it with 'exit'.
  useEffect(() => {
    if (!openedByUser.current) return;
    if (termOpen) inputRef.current?.focus();
    else toggleRef.current?.focus();
  }, [termOpen]);

  const toggleTerminal = () => {
    openedByUser.current = true;
    setTermOpen((open) => !open);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactInfo.email);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 3000);
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setTermLogs([]);
      setInputVal("");
      return;
    }

    const newLogs = [...termLogs, `> ${inputVal}`];
    if (cmd === "resume") {
      newLogs.push("Opening the resume in a new tab.");
      window.open(contactInfo.resumeUrl, "_blank", "noopener");
    } else if (cmd === "exit") {
      setTermOpen(false);
    } else if (Object.hasOwn(commands, cmd)) {
      newLogs.push(...commands[cmd]());
    } else {
      newLogs.push(`Command not recognized: '${cmd}'. Type 'help' for options.`);
    }

    setTermLogs(newLogs);
    setInputVal("");
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-svh w-full flex-col justify-center border-t border-white/10 py-20 md:py-32"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8">
        <p className="text-sm text-accent">Good systems start with a conversation.</p>
        <h2 className="mt-4 font-display text-4xl font-medium tracking-tight text-cream sm:text-6xl md:text-7xl">
          Let's build something
          <br />
          that works.
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/70">
          Agentic workflows. Enterprise software. A considered approach to both.
        </p>

        {/* 1-click email copy widget */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${contactInfo.email}`}
            className="rounded-sm font-display text-xl text-cream underline decoration-white/30 underline-offset-8 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream sm:text-3xl"
          >
            {contactInfo.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-cream transition-colors hover:border-accent hover:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            {copyState === "copied" ? (
              <>
                <Check className="h-3.5 w-3.5 text-accent" />
                <span className="text-accent">Copied to clipboard</span>
              </>
            ) : copyState === "failed" ? (
              <>
                <X className="h-3.5 w-3.5 text-[#ff7a6b]" />
                <span className="text-[#ff7a6b]">Couldn't copy. Select the address instead.</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-white/60" />
                <span>Copy email</span>
              </>
            )}
          </button>
          <span role="status" className="sr-only">
            {copyState === "copied"
              ? "Email copied to clipboard."
              : copyState === "failed"
                ? "Couldn't copy the email. Select the address instead."
                : ""}
          </span>
        </div>

        {/* Actions row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={contactInfo.resumeUrl}
            download
            className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            Download CV <Download className="h-4 w-4" />
          </a>
          <a
            href={contactInfo.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-cream transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={contactInfo.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-cream transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
          >
            LinkedIn <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Interactive terminal */}
        <div className="mt-16 rounded-xl border border-white/10 bg-[#060910] p-4 sm:p-6">
          <button
            ref={toggleRef}
            type="button"
            onClick={toggleTerminal}
            aria-expanded={termOpen}
            aria-controls="cli-panel"
            className="flex w-full items-center justify-between rounded-sm text-left font-mono text-xs text-white/60 transition-colors hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            <span className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              <span>Prefer a terminal? (CLI mode)</span>
            </span>
            <span className="text-accent">{termOpen ? "Collapse [-]" : "Expand [+]"}</span>
          </button>

          {termOpen && (
            <div id="cli-panel" className="mt-4 border-t border-white/10 pt-4 font-mono text-xs">
              <div className="mb-3 flex items-center justify-between text-[11px] text-white/40">
                <span>shoeb@portfolio:~</span>
                <span className="text-accent">ready</span>
              </div>
              <div
                role="log"
                aria-live="polite"
                aria-label="Terminal output"
                className="max-h-56 space-y-1 overflow-y-auto pb-2 text-white/80"
              >
                {termLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
              <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2">
                <span className="text-accent" aria-hidden="true">
                  &gt;
                </span>
                <label htmlFor="cli-input" className="sr-only">
                  Terminal command
                </label>
                <input
                  ref={inputRef}
                  id="cli-input"
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="type 'help', 'skills', or 'projects'"
                  autoComplete="off"
                  spellCheck={false}
                  className="flex-1 bg-transparent text-cream placeholder-white/30 outline-none"
                />
                <button
                  type="submit"
                  className="rounded border border-white/10 px-2.5 py-1 text-[11px] text-white/70 transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream"
                >
                  Run
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
