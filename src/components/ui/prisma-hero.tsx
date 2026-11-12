import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Suspense, lazy, useEffect, useRef } from "react";
import { WordsPullUp } from "@/components/ui/words-pull-up";
import { contactInfo, heroLede } from "@/data/portfolio-data";
import { EASE_OUT, useCanRender3D, useInViewport } from "@/lib/motion";

// Lazy, so three.js loads in its own chunk and never blocks first paint.
const HeroNetwork = lazy(() => import("@/components/three/hero-network"));

export const PrismaHero = () => {
  const reduceMotion = useReducedMotion();
  const canRender3D = useCanRender3D();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroVisible = useInViewport(sectionRef);

  useEffect(() => {
    if (reduceMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [reduceMotion]);

  // Scroll-linked exit: the frame pushes in, the copy lifts away, the network fades.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 0.7], [0, -80]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const networkOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { y: 20, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          transition: {
            duration: 0.8,
            delay,
            ease: EASE_OUT,
          },
        };

  return (
    <section ref={sectionRef} className="h-svh w-full p-2.5 sm:p-3 md:p-4">
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-canvas md:rounded-[2rem]">
        {/* Background video (self-hosted, smaller cut for phones) */}
        <motion.video
          ref={videoRef}
          autoPlay={!reduceMotion}
          loop
          muted
          playsInline
          preload="metadata"
          poster="/assets/hero-poster.jpg"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={reduceMotion ? undefined : { scale: videoScale }}
        >
          <source media="(max-width: 767px)" src="/assets/hero-mobile.mp4" type="video/mp4" />
          <source src="/assets/hero.mp4" type="video/mp4" />
        </motion.video>

        {/* Noise overlay */}
        <div className="noise-overlay pointer-events-none absolute inset-0 opacity-70 mix-blend-overlay" />

        {/* Gradient overlay: protects bottom content band while keeping upper video visible */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,11,18,0.5) 0%, rgba(8,11,18,0.12) 30%, rgba(8,11,18,0.55) 55%, rgba(8,11,18,0.88) 78%, rgba(8,11,18,0.96) 100%)",
          }}
        />

        {/* Loose agent network over the video */}
        {canRender3D && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ opacity: networkOpacity }}
          >
            <Suspense fallback={null}>
              <HeroNetwork active={heroVisible} />
            </Suspense>
          </motion.div>
        )}

        {/* Hero content */}
        <motion.div
          className="absolute inset-x-0 bottom-0 px-4 pb-3 sm:px-6 md:px-10 md:pb-6"
          style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <div className="grid grid-cols-12 items-end gap-4 lg:gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 className="m-0 text-cream text-[clamp(40px,13vw,110px)] leading-[0.88] font-medium tracking-[-0.07em] lg:text-[clamp(46px,9.8vw,144px)]">
                <WordsPullUp text={contactInfo.name} />
              </h1>
            </div>

            <div className="col-span-12 flex flex-col gap-4 pb-2 lg:col-span-4 lg:pb-4">
              <motion.p
                {...rise(0.5)}
                className="m-0 max-w-[40ch] text-sm leading-[1.5] font-normal text-cream/85 sm:text-base md:text-lg"
              >
                {heroLede}
              </motion.p>

              <motion.div {...rise(0.7)} className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="#work"
                  className="group bg-cream focus-visible:outline-cream inline-flex items-center gap-2 rounded-full py-1 pr-1 pl-5 text-sm font-medium text-black no-underline transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-base"
                >
                  See the work
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black transition-transform group-hover:translate-x-0.5 sm:h-10 sm:w-10">
                    <ArrowRight className="text-cream h-4 w-4" aria-hidden="true" />
                  </span>
                </a>
                <a
                  href={contactInfo.resumeUrl}
                  download
                  className="focus-visible:outline-cream rounded-sm text-sm font-medium text-cream underline decoration-cream/40 underline-offset-[6px] transition-colors hover:decoration-cream focus-visible:outline-2 focus-visible:outline-offset-4 sm:text-base"
                >
                  Download CV
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PrismaHero;
