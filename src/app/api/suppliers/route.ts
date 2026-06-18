import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Supplier from "@/models/Supplier";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  leadTimeDays: z.number().min(0).optional(),
  rating: z.number().min(0).max(5).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const data = await Supplier.find().sort({ name: 1 }).lean();
  return ok({ data });
}

export async function POST(req: Request) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid supplier", 400, parsed.error.flatten());
  try {
    const s = await Supplier.create(parsed.data);
    await writeAudit(auth.user.id, "supplier.create", "suppliers", s._id.toString(), `Created supplier ${s.code}`);
    return ok(s, 201);
  } catch (e: any) {
    if (e.code === 11000) return fail("CONFLICT", "Supplier code already exists", 409);
    return fail("SERVER_ERROR", e.message, 500);
  }
}
