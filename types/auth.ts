export interface LoginRequest {
  email: string;
  password: string;
}

export const ROLES = {
  ADMIN: "ROLE_ADMIN",
  USER: "ROLE_USER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function toRole(value: unknown): Role | null {
  if (value === ROLES.ADMIN || value === ROLES.USER) {
    return value;
  }

  return null;
}

export function getRole(roles: unknown[] = []): Role | null {
  if (roles.some((role) => toRole(role) === ROLES.ADMIN)) {
    return ROLES.ADMIN;
  }

  if (roles.some((role) => toRole(role) === ROLES.USER)) {
    return ROLES.USER;
  }

  return null;
}

export interface BackendLoginResponse {
  accessToken: string;
  refreshToken: string;
}
