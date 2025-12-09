// Better Auth configuration for SupplyGraph
// Client-side exports only

// Define Session type locally to avoid server import
export interface Session {
  userId: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  organizationId?: string;
}

// Client-side helper functions
export async function createOrganizationAccount(orgId: string, userId: string, role: string = 'member') {
  // This should be called via a server action
  throw new Error("createOrganizationAccount must be called on the server")
}

export async function getUserOrganizations(userId: string) {
  // This should be called via a server action
  throw new Error("getUserOrganizations must be called on the server")
}

export async function validateOrgAccess(userId: string, orgId: string): Promise<boolean> {
  // This should be called via a server action
  throw new Error("validateOrgAccess must be called on the server")
}