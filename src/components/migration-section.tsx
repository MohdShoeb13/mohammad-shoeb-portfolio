import { contactInfo, migrationStages } from "@/data/portfolio-data";

const before = `public final class Trade {
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
}`;

const after = `// An immutable record with compact validation
public record Trade(
    String id,
    BigDecimal amount
) {
  public Trade {
    Objects.requireNonNull(id, "id is required");
    Objects.requireNonNull(amount, "amount is required");
  }
}

// Pattern matching in switch
switch (order) {
  case Trade(var id, var amt)
      when amt.compareTo(LIMIT) > 0 ->
      auditQueue.publish(id, amt);
  case Trade(var id, var amt) ->
      orderRouter.route(id);
}`;

// How the EPAM migration system works: four agent stages in run order, then what one
// rewrite looks like. The stages are numbered because they are a real sequence.
export const MigrationSection = () => {
  return (
    <section id="modernization" className="relative w-full border-t border-white/10 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h2 className="statement m-0 text-[clamp(36px,5.6vw,84px)] text-cream">
          Java 8 to Java 21,
          <br />
          run by agents.
        </h2>
        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-white/70 sm:text-lg">
          At EPAM I built a migration system on Claude Code and MCP servers. Four agents take
          a service from old Java to new, in order, with little manual work.
        </p>

        <ol className="m-0 mt-12 grid list-none grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {migrationStages.map((stage, i) => (
            <li key={stage.title} className="flex flex-col bg-canvas p-6 sm:p-7">
              <span className="font-mono text-xs text-accent">Stage {i + 1}</span>
              <strong className="mt-6 text-lg font-medium text-cream sm:text-xl">
                {stage.title}
              </strong>
              <span className="mt-2 text-sm leading-relaxed text-white/65">{stage.detail}</span>
            </li>
          ))}
        </ol>

        {/* One rewrite, before and after */}
        <div className="mt-6 grid grid-cols-1 gap-6 font-mono text-xs md:grid-cols-2">
          <figure className="m-0 flex flex-col rounded-2xl border border-white/10 bg-[#060a12] p-5">
            <figcaption className="border-b border-white/10 pb-3 text-white/55">
              Before: a Java 8 class
            </figcaption>
            <pre className="m-0 mt-4 overflow-x-auto leading-relaxed text-white/60 [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]">
              <code>{before}</code>
            </pre>
          </figure>

          <figure className="m-0 flex flex-col rounded-2xl border border-accent/30 bg-[#0b1424] p-5">
            <figcaption className="border-b border-accent/20 pb-3 text-accent">
              After: a Java 21 record
            </figcaption>
            <pre className="m-0 mt-4 overflow-x-auto leading-relaxed text-cream [scrollbar-color:rgba(255,255,255,0.25)_transparent] [scrollbar-width:thin]">
              <code>{after}</code>
            </pre>
          </figure>
        </div>

        <div className="mt-5 flex flex-col gap-2 font-mono text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p className="m-0">An illustrative rewrite. Not client source code.</p>
          <a
            href={`mailto:${contactInfo.email}?subject=Java%20migration%20workflow`}
            className="rounded-sm text-accent underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
          >
            Ask me about this workflow
          </a>
        </div>
      </div>
    </section>
  );
};
