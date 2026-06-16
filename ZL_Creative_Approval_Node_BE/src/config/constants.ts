export const a = 1;
export const b = 2;

// Roles for authentication
export const ROLES = {
  ADMIN: "admin",
  TEAM_LEAD: "team_lead",
  TEAM_MEMBER: "team_member",
  CLIENT: "client",
} as const;

//(typeof Roles)[keyof typeof Roles] gives the values ("admin" | "team_lead" | "team_member" | "client").
// This means any variable of type RoleType can only have one of these four values.
// const userRole: RoleType = "admin"; // ✅ Valid
// const anotherRole: RoleType = "manager"; // ❌ TypeScript Error: Not in RoleType

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const pod_selection = {
  // Select fields from Pod itself (if any)
  id: true, // Example: Pod fields
  name: true,
  // Select fields from podLeader
  podLeader: {
    id: true,
    email: true, // Add other fields as needed
    name: true,
  },
  // Select fields from members
  members: {
    id: true,
    email: true, // Add other fields as needed
    name: true,
  },
};

export const brand_selection = {
  id: true,
  name: true,
  performanceMarketer: {
    id: true,
    name: true,
  },
  pod: {
    id: true,
    name: true,
  },
};
