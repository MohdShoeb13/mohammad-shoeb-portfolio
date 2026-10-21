import { useState, useRef } from "react";
import { motion } from "framer-motion";

export const MigrationSection = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <section id="migration" className="relative w-full py-16 md:py-28 border-t border-white/10 bg-[#080d17]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Selected work / Enterprise engineering
          </span>
          <span className="font-mono text-xs text-white/40">02</span>
        </div>
        <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-medium tracking-tight text-cream sm:text-4xl md:text-5xl">
              Modernizing Java.
              <br />
              Coordinating the whole workflow.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
              Dependency analysis → API refactoring → build updates → regression validation. Claude
              Code and MCP coordinate the workflow across enterprise projects with minimal human
              intervention.
            </p>
          </div>
          <div className="font-mono text-xs text-white/50">
            Interactive side-by-side refactor
          </div>
        </div>

        {/* Code Comparison Card with interactive slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#060a12] p-4 sm:p-6"
        >
          {/* Top control bar */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-cream/70">
                Split: <strong className="text-accent">{sliderPos}%</strong>
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={handleSliderChange}
                aria-label="Compare Java 8 to Java 21 code"
                className="w-32 sm:w-48 accent-accent cursor-pointer"
              />
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-white/40">← Drag or slide to compare</span>
              <a
                href="mailto:shoebmohd13@gmail.com"
                className="text-accent hover:underline hidden sm:inline-block"
              >
                Discuss this workflow ↗
              </a>
            </div>
          </div>

          {/* Dual Panes Container with dynamic grid column weighting based on slider */}
          <div
            ref={containerRef}
            className="grid grid-cols-1 md:grid-cols-12 gap-4 font-mono text-xs"
          >
            {/* Java 8 Pane */}
            <div
              className="md-dynamic-span flex flex-col rounded-xl border border-white/10 bg-[#080d16] p-4 transition-all"
              style={
                {
                  "--pane-span": Math.max(3, Math.min(9, Math.round((sliderPos / 100) * 12))),
                } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-white/50">
                <span>JAVA 8 / CLASS</span>
                <span className="text-white/30">Illustrative</span>
              </div>
              <pre className="mt-3 overflow-x-auto text-white/70 leading-relaxed">
                <code>{`public final class Trade {
  private final String id;
  private final BigDecimal amount;

  public Trade(String id, BigDecimal amount) {
    this.id = Objects.requireNonNull(id);
    this.amount = Objects.requireNonNull(amount);
  }

  public String getId() { return id; }
  public BigDecimal getAmount() { return amount; }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (!(o instanceof Trade)) return false;
    Trade trade = (Trade) o;
    return id.equals(trade.id) && 
           amount.equals(trade.amount);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, amount);
  }
}`}</code>
              </pre>
            </div>

            {/* Java 21 Pane */}
            <div
              className="md-dynamic-span flex flex-col rounded-xl border border-accent/30 bg-[#0b1424] p-4 transition-all"
              style={
                {
                  "--pane-span": Math.max(3, Math.min(9, 12 - Math.round((sliderPos / 100) * 12))),
                } as React.CSSProperties
              }
            >
              <div className="flex items-center justify-between border-b border-accent/20 pb-2 text-[11px] text-accent/80">
                <span>JAVA 21 / RECORD</span>
                <span className="text-accent/60">Modernized</span>
              </div>
              <pre className="mt-3 overflow-x-auto text-cream leading-relaxed">
                <code>{`// Clean, immutable record with compact validation
public record Trade(
    String id, 
    BigDecimal amount
) {
  public Trade {
    Objects.requireNonNull(id, "id must not be null");
    Objects.requireNonNull(amount, "amount must not be null");
  }
}

// Integrated Pattern Matching in switch
switch (order) {
  case Trade(var id, var amt) when amt.compareTo(LIMIT) > 0 -> 
      auditQueue.publish(id, amt);
  case Trade(var id, var amt) -> 
      orderRouter.route(id);
}`}</code>
              </pre>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs font-mono text-white/40 pt-2 border-t border-white/5">
            <p>Illustrative data-carrier rewrite. Not client source code.</p>
            <a href="mailto:shoebmohd13@gmail.com" className="text-accent hover:underline sm:hidden mt-2">
              Discuss this workflow ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
