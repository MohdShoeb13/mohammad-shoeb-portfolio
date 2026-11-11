import { contactInfo } from "@/data/portfolio-data";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#05080e] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 font-mono text-xs text-white/50 sm:flex-row sm:items-center sm:px-6 md:px-8">
        <span>
          {contactInfo.name}, {contactInfo.location}
        </span>
        <span>Built with React and three.js.</span>
        <a
          href="#top"
          className="rounded-sm text-cream/80 underline-offset-4 transition-colors hover:text-cream hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
};
