import type { Metadata } from "next";
import { MarketingHero } from "@/components/layout/MarketingHero";
import { LegalContent } from "@/components/layout/LegalContent";

export const metadata: Metadata = { title: "Privacy Policy" };

const sections = [
  { heading: "Our approach to privacy", body: ["Eduversal MathQuest is designed with child safety and data minimisation at its core. We collect only what is needed to deliver the learning experience."] },
  { heading: "Information we process", body: ["For learners: a first name, class, and learning-progress records. For staff and parents: name, email and role.", "We do not show advertising and we do not sell personal data."] },
  { heading: "How data is used", body: ["Data is used to personalise learning, generate progress reports, and enable teacher, manager and parent oversight within the same school."] },
  { heading: "Data scoping", body: ["Access is strictly role-scoped. Students see only their own data; parents see only officially linked children; managers see only their own school."] },
  { heading: "Security", body: ["The production platform will use encrypted connections and a secure database. This prototype stores demo data locally in your browser only."] },
  { heading: "Your rights", body: ["Schools and parents may request access to, correction of, or deletion of personal data in line with applicable regulations."] },
  { heading: "Contact", body: ["For privacy questions, contact the Eduversal team via the Contact page."] },
];

export default function PrivacyPage() {
  return (
    <>
      <MarketingHero eyebrow="Legal" title="Privacy Policy" subtitle="How Eduversal MathQuest handles data — prototype summary." />
      <LegalContent sections={sections} />
    </>
  );
}
