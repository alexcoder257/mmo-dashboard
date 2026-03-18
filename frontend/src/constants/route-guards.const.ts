interface IRouteGuard {
  requiresAuth: boolean;
  roles: string[];
}

export const ROUTE_GUARDS: Record<string, IRouteGuard> = {};
