import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Warehouse from "@/models/Warehouse";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

const schema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  address: z.record(z.string()).optional(),
  zones: z.array(z.object({ code: z.string(), name: z.string().optional(), bins: z.array(z.string()).optional() })).optional(),
  isActive: z.boolean().optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const data = await Warehouse.find().sort({ code: 1 }).lean();
  return ok({ data });
}

export async function POST(req: Request) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid warehouse", 400, parsed.error.flatten());
  try {
    const wh = await Warehouse.create(parsed.data);
    await writeAudit(auth.user.id, "warehouse.create", "warehouses", wh._id.toString(), `Created warehouse ${wh.code}`);
    return ok(wh, 201);
  } catch (e: any) {
    if (e.code === 11000) return fail("CONFLICT", "Warehouse code already exists", 409);
    return fail("SERVER_ERROR", e.message, 500);
  }
}
