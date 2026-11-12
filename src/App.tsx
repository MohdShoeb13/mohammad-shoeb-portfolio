import { Header, Loader, SideIndex } from "@/components/two-sides/chrome";
import { IntroStory } from "@/components/two-sides/story";
import {
  BackSection,
  ChooseSection,
  FinaleSection,
  FrontSection,
  ProfileSection,
  SiteFooter,
} from "@/components/two-sides/sections";
import { ExperienceSection } from "@/components/experience-section";
import { ExpertiseSection } from "@/components/expertise-section";

/*
 * A page with two sides. Paper is the front, what people see. Night is the back,
 * what keeps it running. The story at the top sets that up, and every section
 * after it belongs to one side or stands on the line between them.
 */
export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-paper text-ink selection:bg-front/25">
      <Loader />
      <Header />
      <SideIndex />

      <main id="main" tabIndex={-1} className="relative w-full outline-none">
        {/* 01. The story: every system has two sides */}
        <IntroStory />

        {/* 02. The front: projects, as a row of screens */}
        <FrontSection />

        {/* 03. The back: the systems behind them */}
        <BackSection />

        {/* 04. Who builds both, then the record on paper */}
        <ProfileSection />
        <div className="paper-grain relative bg-paper text-ink">
          <ExperienceSection />
          <ExpertiseSection />
        </div>

        {/* 05. Pick a kind of work */}
        <ChooseSection />

        {/* 06. Both sides, and how to get in touch */}
        <FinaleSection />
      </main>

      <SiteFooter />
    </div>
  );
}
