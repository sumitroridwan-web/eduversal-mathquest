import type { Metadata } from "next";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { LegalContent } from "@/components/layout/LegalContent";

export const metadata: Metadata = { title: "Terms of Service" };

const sections = [
  { heading: "Acceptance of terms", body: ["By accessing Eduversal MathQuest you agree to these terms. Schools accept on behalf of their staff and enrolled learners."] },
  { heading: "Educational use", body: ["The platform is provided for educational use within participating schools and homes. Content may not be resold or redistributed."] },
  { heading: "Accounts and roles", body: ["Access is role-based. Administrator accounts are provisioned by Eduversal and are not available through public sign-up.", "Users are responsible for keeping their credentials secure."] },
  { heading: "Child safety", body: ["Student accounts are scoped so that learners access only their own data. Schools are responsible for obtaining appropriate consent for pupil accounts."] },
  { heading: "Content and curriculum", body: ["Learning-objective summaries are original Eduversal content. Curriculum reference codes are configurable and are provided for alignment convenience only."] },
  { heading: "Acceptable use", body: ["Users must not attempt to disrupt the service, access other users' data, or upload unlawful content."] },
  { heading: "Changes to the service", body: ["We may update features and content to improve the learning experience. Material changes will be communicated to school administrators."] },
];

export default function TermsPage() {
  return (
    <>
      <MarketingHero eyebrow="Legal" title="Terms of Service" subtitle="Prototype terms for the Eduversal MathQuest platform." />
      <LegalContent sections={sections} />
    </>
  );
}
