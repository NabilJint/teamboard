export interface Context {
  headers: Headers;
  user?: { id: string; email?: string; name?: string };
  tenant?: {
    organizationId: string;
    userId: string;
    role: string;
    plan: string;
  };
}

export function createContext(headers: Headers): Context {
  return { headers };
}
