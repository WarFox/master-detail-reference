export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  status: 'Active' | 'Prospect' | 'Inactive';
  joinedDate: string;
  notes: string;
  websiteUrl: string;
}

export const mockCustomers: Customer[] = [
  {
    id: "customer-1",
    name: "Priya Nair",
    company: "Northwind Logistics",
    email: "priya.nair@northwind.example",
    status: "Active",
    joinedDate: "2025-11-03",
    notes: "Renewed annual contract early. Interested in the upcoming analytics add-on once it ships.",
    websiteUrl: "#northwind"
  },
  {
    id: "customer-2",
    name: "Marcus Webb",
    company: "Fenwick & Rowe",
    email: "marcus.webb@fenwickrowe.example",
    status: "Prospect",
    joinedDate: "2026-06-14",
    notes: "Evaluating against two competitors. Needs a security review call before signing.",
    websiteUrl: "#fenwick-rowe"
  },
  {
    id: "customer-3",
    name: "Elena Castillo",
    company: "Bright Harbor Studio",
    email: "elena.castillo@brightharbor.example",
    status: "Inactive",
    joinedDate: "2024-02-19",
    notes: "Paused subscription during a budget freeze. Check back in Q3 for reactivation.",
    websiteUrl: "#bright-harbor"
  }
];
