import type { Plan, Role } from "@/server/resources";
import type { Plan as ResourcesPlan } from "@/server/resources";

// SOT: context, headers, user, tenant, tRPC context, request context
// WHAT: Defines the tRPC Context interface and createContext factory that builds ctx from request headers only.
// WHY: Without this, middleware would have no place to store authenticated user and verified tenant data.
// HOW: Returns { headers } with optional user and tenant fields that middleware sets via next({ ctx }).
// WHERE: Called by the tRPC route handler to build context for every request.

export interface Context {
  headers: Headers;
  user?: { id: string; email?: string; name?: string };
  tenant?: {
    organizationId: string;
    userId: string;
    role: Role;
    plan: Plan;
  };
  plan?: ResourcesPlan;
}

export function createContext(headers: Headers): Context {
  return { headers };
}
