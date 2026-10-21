import { motion } from "framer-motion";
import { secondaryWorkData } from "@/data/portfolio-data";

export const SecondaryWorkSection = () => {
  return (
    <section id="hold" className="relative w-full py-16 md:py-24 border-t border-white/10 bg-[#070b14]/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <span className="font-mono text-xs uppercase tracking-widest text-accent">
          Beyond the featured work
        </span>
        <h2 className="mt-3 font-display text-2xl sm:text-3xl font-medium tracking-tight text-cream">
          More things I've built.
        </h2>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {secondaryWorkData.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-xs transition-colors hover:border-white/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-medium text-cream">{item.title}</h3>
                  <span className="font-mono text-[11px] rounded-full border border-white/10 px-2.5 py-0.5 text-white/60">
                    {item.badge}
                  </span>
                </div>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
