import type { Plan, Role } from "@/generated/prisma/client";
import type { Plan as ResourcesPlan } from "@/server/resources";

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
