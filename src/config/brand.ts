// ==========================================================
// Eduversal MathQuest — Brand configuration
// ==========================================================

export const brand = {
  name: "Eduversal MathQuest",
  shortName: "MathQuest",
  tagline: "Play. Explore. Master Maths.",
  supportingLine:
    "Interactive Mathematics games, simulations, and digital books for confident young learners.",
  owner: "Managed by Eduversal Indonesia",
  heroTitle: "Every Maths Skill Starts with a Quest.",
  email: "hello@eduversal.org",
  supportEmail: "support@eduversal.org",
  year: 2026,
};

// Publisher-agnostic curriculum labels (configurable by Admin).
export const curriculumConfig = {
  earlyYearsName: "Cambridge Early Years",
  primaryName: "Cambridge Primary Mathematics",
  // Default grade → stage mapping (Admin-configurable in a real backend).
  gradeToStage: {
    "Grade 1": "Stage 1",
    "Grade 2": "Stage 2",
    "Grade 3": "Stage 3",
    "Grade 4": "Stage 4",
    "Grade 5": "Stage 5",
    "Grade 6": "Stage 6",
  } as Record<string, string>,
};
