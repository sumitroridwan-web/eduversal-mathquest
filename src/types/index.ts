// ==========================================================
// Eduversal MathQuest — Shared TypeScript types
// ==========================================================

export type Role =
  | "admin"
  | "school-manager"
  | "teacher"
  | "student"
  | "parent";

export type SignUpRole = Exclude<Role, "admin">;

export interface User {
  id: string;
  name: string;
  firstName: string;
  email: string;
  phone?: string;
  role: Role;
  schoolId?: string;
  schoolName?: string;
  avatar?: string; // emoji or avatar key
  // student-specific
  classId?: string;
  gradeLevel?: string;
  points?: number;
  // parent-specific
  childIds?: string[];
}

// ---------------- Curriculum ----------------

export type Programme = "early-years" | "primary";

export type EarlyYearsBand = "Nursery / Pre-K" | "Kindergarten 1" | "Kindergarten 2";

export type PrimaryStage =
  | "Stage 1"
  | "Stage 2"
  | "Stage 3"
  | "Stage 4"
  | "Stage 5"
  | "Stage 6";

export type Strand =
  | "Number"
  | "Geometry and Measure"
  | "Statistics and Probability"
  | "Algebra"
  | "Early Mathematical Experiences"; // Early Years umbrella strand

export type TWMCharacteristic =
  | "Specialising"
  | "Generalising"
  | "Conjecturing"
  | "Convincing"
  | "Characterising"
  | "Classifying"
  | "Critiquing"
  | "Improving";

export type LearningPurpose =
  | "Introduction"
  | "Practice"
  | "Consolidation"
  | "Assessment"
  | "Intervention"
  | "Extension";

export type Difficulty = "Foundation" | "Core" | "Challenge";

export type ContentType = "game" | "simulation" | "book";

export type ContentStatus = "published" | "draft" | "review" | "archived";

export type AssessmentDescriptor =
  | "Beginning"
  | "Developing"
  | "Secure"
  | "Ready for Extension";

export interface CurriculumObjective {
  /** Teacher-facing learning objective */
  teacher: string;
  /** Student-friendly "I can" statement */
  student: string;
  /** Parent-friendly explanation */
  parent: string;
}

export interface Resource {
  id: string;
  title: string;
  type: ContentType;
  status: ContentStatus;
  cover: string; // gradient/illustration key
  programme: Programme;
  band?: EarlyYearsBand; // early years
  stage?: PrimaryStage; // primary
  gradeLevel?: string;
  strand: Strand;
  subStrand: string;
  topic: string;
  objective: CurriculumObjective;
  curriculumRef: string; // configurable reference code e.g. EDV-N1.03
  twm?: TWMCharacteristic;
  vocabulary: string[];
  learningPurpose: LearningPurpose;
  difficulty: Difficulty;
  durationMins: number;
  prerequisites?: string;
  teachingApproach?: string;
  assessmentMethod?: string;
  evidenceOfLearning?: string;
  materials?: string[]; // suggested physical materials
  teacherNotes?: string;
  parentGuidance?: string;
  offlineExtension?: string;
  observationIndicators?: string[];
  nextStep?: string;
  thinkPrompt?: string; // "Think Like a Mathematician"
  reasoningPrompt?: string;
  reflectionPrompt?: string;
  supportActivity?: string;
  extensionActivity?: string;
  discussionPrompts?: string[]; // simulations
  accessibility?: string;
  reviewDate?: string;
  relatedIds?: string[];
  // book-specific
  chapters?: BookChapter[];
  // engagement stats (mock)
  rating?: number;
  plays?: number;
}

export interface BookChapter {
  title: string;
  body: string;
  checkpoint?: { question: string; answer: string };
}

// ---------------- Schools / Classes ----------------

export interface School {
  id: string;
  name: string;
  location: string;
  managerName: string;
  teachers: number;
  students: number;
  parents: number;
  activeStudents: number;
  status: "active" | "onboarding" | "suspended";
  joined: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  gradeLevel: string;
  stage: PrimaryStage | EarlyYearsBand;
  teacherId: string;
  teacherName: string;
  schoolId: string;
  studentIds: string[];
  avgProgress: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  firstName: string;
  classId: string;
  className: string;
  gradeLevel: string;
  avatar: string;
  progress: number; // 0-100 overall mastery
  points: number;
  badges: number;
  streak: number;
  lastActive: string;
  needsSupport: boolean;
  readyForExtension: boolean;
  strandMastery: { strand: Strand; mastery: number }[];
}

// ---------------- Assignments / Quest Paths ----------------

export interface Assignment {
  id: string;
  title: string;
  resourceIds: string[];
  assignedTo: { type: "class" | "group" | "student"; id: string; label: string };
  programme: Programme;
  stageOrBand: string;
  strand: Strand;
  objective: CurriculumObjective;
  twm?: TWMCharacteristic;
  instructions: string;
  materials?: string;
  dueDate: string;
  assessmentApproach: string;
  successCriteria: string;
  differentiation: Difficulty;
  parentGuidance?: string;
  createdBy: string;
  createdAt: string;
  status: "active" | "scheduled" | "closed";
  completion: number; // percent
  totalStudents: number;
  completedStudents: number;
}

export interface QuestPath {
  id: string;
  title: string;
  description: string;
  strand: Strand;
  stageOrBand: string;
  steps: { resourceId: string; label: string }[];
  assignedClass?: string;
  createdBy: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  criteria: string;
  tier: "bronze" | "silver" | "gold";
  earned?: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: Role[] | "all";
  author: string;
  date: string;
  scope: "platform" | "school";
}

export interface StudentAssignmentProgress {
  assignmentId: string;
  title: string;
  resourceTitle: string;
  type: ContentType;
  status: "not-started" | "in-progress" | "completed" | "needs-review";
  score?: number;
  attempts: number;
  dueDate: string;
  descriptor?: AssessmentDescriptor;
}

// ---------------- UI helpers ----------------

export interface NavItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
}
