import { useState } from "react";
import { Copy, Check, Terminal, Download, ExternalLink } from "lucide-react";

export const ContactSection = () => {
  const [copied, setCopied] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [termLogs, setTermLogs] = useState<string[]>([
    "Mohammad Shoeb portfolio interactive shell v1.0",
    "Type 'help' to see available commands.",
  ]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("shoebmohd13@gmail.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...termLogs, `> ${inputVal}`];

    switch (cmd) {
      case "help":
        newLogs.push(
          "Available commands: bio, skills, projects, contact, resume, clear, exit"
        );
        break;
      case "bio":
        newLogs.push(
          "Mohammad Shoeb: Senior Java & Agentic AI engineer with 6+ years experience building enterprise systems & autonomous multi-agent pipelines."
        );
        break;
      case "skills":
        newLogs.push(
          "Core skills: LangGraph, FastAPI, React, Spring Boot, Java 21, Kafka, MCP, Python, Docker, Kubernetes, AWS."
        );
        break;
      case "projects":
        newLogs.push(
          "1. Fin Expert (6-agent financial education workspace)",
          "2. Resonant (Call summarizer & evidence scoring)",
          "3. Email Assistant (7-agent tone & intent loop)",
          "4. ContentBlitz (Autonomous content creation system)"
        );
        break;
      case "contact":
        newLogs.push("Email: shoebmohd13@gmail.com", "Location: New Delhi, India");
        break;
      case "resume":
        newLogs.push("Opening resume download link...");
        window.open("/assets/mohammad-shoeb-resume.pdf", "_blank");
        break;
      case "clear":
        setTermLogs([]);
        setInputVal("");
        return;
      case "exit":
        setTermOpen(false);
        break;
      default:
        newLogs.push(`Command not recognized: '${cmd}'. Type 'help' for options.`);
    }

    setTermLogs(newLogs);
    setInputVal("");
  };

  return (
    <section id="emit" className="relative w-full py-20 md:py-32 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Good systems start with a conversation.
        </span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-tight text-cream sm:text-5xl md:text-6xl">
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
            href="mailto:shoebmohd13@gmail.com"
            className="font-display text-xl sm:text-3xl text-cream hover:text-accent transition-colors underline decoration-white/30 underline-offset-8"
          >
            shoebmohd13@gmail.com
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 font-mono text-xs text-cream hover:border-accent hover:bg-accent/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-accent" />
                <span className="text-accent">Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-white/60" />
                <span>Copy email</span>
              </>
            )}
          </button>
        </div>

        {/* Actions row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="/assets/mohammad-shoeb-resume.pdf"
            download
            className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-medium text-black hover:bg-white transition-colors"
          >
            Download CV <Download className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/MohdShoeb13"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-cream hover:border-accent transition-colors"
          >
            GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href="https://linkedin.com/in/mohd-shoeb"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-mono text-xs text-cream hover:border-accent transition-colors"
          >
            LinkedIn <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Interactive Terminal Accordion */}
        <div className="mt-16 rounded-xl border border-white/10 bg-[#060910] p-4 sm:p-6">
          <button
            type="button"
            onClick={() => setTermOpen(!termOpen)}
            className="flex w-full items-center justify-between text-left font-mono text-xs text-white/60 hover:text-cream transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-accent" />
              <span>Prefer a terminal? (CLI mode)</span>
            </div>
            <span className="text-accent">{termOpen ? "Collapse [-]" : "Expand [+]"}</span>
          </button>

          {termOpen && (
            <div className="mt-4 border-t border-white/10 pt-4 font-mono text-xs">
              <div className="flex items-center justify-between text-white/40 mb-3 text-[11px]">
                <span>shoeb@portfolio:~</span>
                <span className="text-accent">ready</span>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1 text-white/80 pb-2">
                {termLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
              <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2">
                <span className="text-accent">&gt;</span>
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="type 'help', 'skills', or 'projects'"
                  className="flex-1 bg-transparent text-cream placeholder-white/30 outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded border border-white/10 px-2.5 py-1 text-[11px] text-white/70 hover:border-accent hover:text-accent"
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
