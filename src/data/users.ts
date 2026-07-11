import type { User, Role } from "@/types";

export interface DemoAccount {
  user: User;
  password: string;
  blurb: string;
}

/** Demo accounts — one per role. Passwords are for the prototype only. */
export const demoAccounts: DemoAccount[] = [
  {
    password: "demo1234",
    blurb: "Full platform management across all schools",
    user: {
      id: "u-admin",
      name: "Amara Sett",
      firstName: "Amara",
      email: "admin@eduversal.org",
      phone: "+62 811 0000 001",
      role: "admin",
      avatar: "🛰️",
    },
  },
  {
    password: "demo1234",
    blurb: "Oversees Bright Horizons International School",
    user: {
      id: "u-manager",
      name: "Rudi Prakoso",
      firstName: "Rudi",
      email: "manager@eduversal.org",
      phone: "+62 811 0000 002",
      role: "school-manager",
      schoolId: "sch-1",
      schoolName: "Bright Horizons International School",
      avatar: "🏫",
    },
  },
  {
    password: "demo1234",
    blurb: "Teaches Stage 2 & 3 Mathematics",
    user: {
      id: "u-teacher",
      name: "Nadia Rahman",
      firstName: "Nadia",
      email: "teacher@eduversal.org",
      phone: "+62 811 0000 003",
      role: "teacher",
      schoolId: "sch-1",
      schoolName: "Bright Horizons International School",
      avatar: "👩‍🏫",
    },
  },
  {
    password: "demo1234",
    blurb: "Stage 2 learner on a counting & place value quest",
    user: {
      id: "u-student",
      name: "Bimo Santoso",
      firstName: "Bimo",
      email: "student@eduversal.org",
      role: "student",
      schoolId: "sch-1",
      schoolName: "Bright Horizons International School",
      classId: "cls-2a",
      gradeLevel: "Grade 2",
      points: 1840,
      avatar: "🦊",
    },
  },
  {
    password: "demo1234",
    blurb: "Parent of Bimo and Sari",
    user: {
      id: "u-parent",
      name: "Dewi Santoso",
      firstName: "Dewi",
      email: "parent@eduversal.org",
      phone: "+62 811 0000 005",
      role: "parent",
      schoolId: "sch-1",
      schoolName: "Bright Horizons International School",
      childIds: ["stu-1", "stu-7"],
      avatar: "🌷",
    },
  },
];

export function findDemoAccount(email: string, password: string): User | null {
  const match = demoAccounts.find(
    (a) => a.user.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  return match ? match.user : null;
}

export function demoUserForRole(role: Role): User {
  const match = demoAccounts.find((a) => a.user.role === role);
  return match ? match.user : demoAccounts[0].user;
}

// Additional platform users for the Admin users table.
export const platformUsers: User[] = [
  ...demoAccounts.map((a) => a.user),
  {
    id: "u-t2",
    name: "James Okoro",
    firstName: "James",
    email: "j.okoro@brighthorizons.sch",
    role: "teacher",
    schoolId: "sch-1",
    schoolName: "Bright Horizons International School",
    avatar: "👨‍🏫",
  },
  {
    id: "u-m2",
    name: "Sinta Wijaya",
    firstName: "Sinta",
    email: "s.wijaya@cendekia.sch",
    role: "school-manager",
    schoolId: "sch-2",
    schoolName: "Cendekia Montessori Academy",
    avatar: "🏫",
  },
  {
    id: "u-t3",
    name: "Grace Mbeki",
    firstName: "Grace",
    email: "g.mbeki@cendekia.sch",
    role: "teacher",
    schoolId: "sch-2",
    schoolName: "Cendekia Montessori Academy",
    avatar: "👩‍🏫",
  },
  {
    id: "u-p2",
    name: "Arif Hidayat",
    firstName: "Arif",
    email: "a.hidayat@mail.com",
    role: "parent",
    schoolId: "sch-2",
    schoolName: "Cendekia Montessori Academy",
    avatar: "🌿",
  },
];
