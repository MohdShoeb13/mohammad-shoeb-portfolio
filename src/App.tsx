import { SiteNav } from "@/components/site-nav";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { IntroSection } from "@/components/intro-section";
import { ProjectsSection } from "@/components/projects-section";
import { MigrationSection } from "@/components/migration-section";
import { ExperienceSection } from "@/components/experience-section";
import { SecondaryWorkSection } from "@/components/secondary-work";
import { ExpertiseSection } from "@/components/expertise-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

/*
 * The page travels through two grounds. Night holds the live systems: hero, work,
 * method. Paper holds the record: outcomes, roles, toolkit. Night returns for contact.
 */
export default function App() {
  return (
    <div id="top" className="relative min-h-screen w-full bg-canvas text-cream selection:bg-accent/30 selection:text-white">
      {/* Fixed navigation, scroll progress and skip link */}
      <SiteNav />

      {/* 1. Hero: video, loose 3D agent network, name */}
      <PrismaHero />

      <main id="main" tabIndex={-1} className="relative z-10 w-full outline-none">
        {/* 2. Opening statement, quick facts and the technology ribbon */}
        <IntroSection />

        {/* 3. Featured work and the 3D architecture graph */}
        <ProjectsSection />

        {/* 4. How the Java migration system works */}
        <MigrationSection />

        {/* 5. Two smaller builds */}
        <SecondaryWorkSection />

        {/* 6 and 7. The record, on paper: a sheet inset like the hero stage */}
        <div className="paper-grain relative mx-2.5 rounded-2xl bg-paper text-ink selection:bg-cobalt/20 selection:text-ink sm:mx-3 md:mx-4 md:rounded-[2rem]">
          <ExperienceSection />
          <ExpertiseSection />
        </div>

        {/* 8. Contact and the terminal */}
        <ContactSection />
      </main>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
