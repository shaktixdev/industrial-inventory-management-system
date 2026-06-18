import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, hasRole } from "@/lib/auth";
import { Role } from "@/types";
import AuditLog from "@/models/AuditLog";
import { connectDB } from "@/lib/mongodb";

export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: { code, message, details } }, { status });
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * Returns the session user if authenticated and (optionally) meeting a minimum role.
 * Throws a NextResponse via the returned `response` field when unauthorized.
 */
export async function requireAuth(minRole?: Role): Promise<
  | { user: SessionUser; response: null }
  | { user: null; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  if (!user) {
    return { user: null, response: fail("UNAUTHORIZED", "Authentication required", 401) };
  }
  if (minRole && !hasRole(user.role, minRole)) {
    return {
      user: null,
      response: fail("FORBIDDEN", `Requires ${minRole} role or higher`, 403),
    };
  }
  return { user, response: null };
}

export async function writeAudit(
  actorId: string,
  action: string,
  entity: string,
  entityId: string,
  summary: string,
  metadata?: unknown
) {
  try {
    await connectDB();
    await AuditLog.create({ actor: actorId, action, entity, entityId, summary, metadata });
  } catch {
    // Audit must never break the main request.
  }
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10) || 20));
  return { page, limit, skip: (page - 1) * limit };
}
