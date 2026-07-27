export interface WorkItem {
  id: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  status: 'In Progress' | 'Reviewed' | 'Completed';
  body: string;
  referenceUrl: string;
}

export const mockItems: WorkItem[] = [
  {
    id: "task-1",
    title: "Database Migration to Global Clusters",
    summary: "Plan and map out database topology schemas across global regions.",
    author: "Alex Rivera",
    date: "2026-07-27",
    status: "In Progress",
    body: "This item addresses regional latency constraints. We are evaluating cluster replications across three central server locations. Preliminary connection benchmarks show a 40% reduction in secondary lookups when utilizing the new schema routing patterns.",
    referenceUrl: "#migration-docs"
  },
  {
    id: "task-2",
    title: "Update Design System Tokens",
    summary: "Sync foundational layout variables with the updated branding style guide.",
    author: "Jordan Lee",
    date: "2026-07-25",
    status: "Completed",
    body: "All structural layout properties, colour profiles, and font weight tokens have been completely refactored. The changes ensure AAA contrast compliance throughout the core views and components.",
    referenceUrl: "#design-tokens"
  },
  {
    id: "task-3",
    title: "Security Middleware Refactor",
    summary: "Audit and upgrade session cookie validations and token timeouts.",
    author: "Morgan Chen",
    date: "2026-07-22",
    status: "Reviewed",
    body: "Migrated stateful validation models over to cryptographically signed edge tokens. This structural modification limits authentication database requests and mitigates potential brute force vectors on central APIs.",
    referenceUrl: "#security-audit"
  }
];
