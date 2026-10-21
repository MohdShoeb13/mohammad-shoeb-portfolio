import { SiteNav } from "@/components/site-nav";
import { PrismaHero } from "@/components/ui/prisma-hero";
import { MetricsSection } from "@/components/metrics-section";
import { ProjectsSection } from "@/components/projects-section";
import { MigrationSection } from "@/components/migration-section";
import { ExperienceSection } from "@/components/experience-section";
import { SecondaryWorkSection } from "@/components/secondary-work";
import { ExpertiseSection } from "@/components/expertise-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-canvas text-cream selection:bg-accent/30 selection:text-white">
      {/* Fixed navigation, scroll progress and skip link */}
      <SiteNav />

      {/* 1. Hero: video, loose 3D agent network, name */}
      <PrismaHero />

      <main id="main" tabIndex={-1} className="relative z-10 w-full outline-none">
        {/* 2. Key Metrics & Tech Marquee */}
        <MetricsSection />

        {/* 3. Featured work and the 3D architecture graph */}
        <ProjectsSection />

        {/* 4. Java Modernization & Workflow Architecture */}
        <MigrationSection />

        {/* 5. Experience, 2019 to present */}
        <ExperienceSection />

        {/* 6. Secondary Work */}
        <SecondaryWorkSection />

        {/* 7. Expertise, Education & Certifications */}
        <ExpertiseSection />

        {/* 8. Contact & Interactive CLI Terminal */}
        <ContactSection />
      </main>

      {/* 9. Minimal Footer */}
      <Footer />
    </div>
  );
}
