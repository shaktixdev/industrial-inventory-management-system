import { z } from "zod";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  parent: z.string().nullable().optional(),
});

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const data = await Category.find().sort({ name: 1 }).lean();
  return ok({ data });
}

export async function POST(req: Request) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("VALIDATION_ERROR", "Invalid category", 400, parsed.error.flatten());
  try {
    const cat = await Category.create(parsed.data);
    await writeAudit(auth.user.id, "category.create", "categories", cat._id.toString(), `Created category ${cat.name}`);
    return ok(cat, 201);
  } catch (e: any) {
    if (e.code === 11000) return fail("CONFLICT", "Category name already exists", 409);
    return fail("SERVER_ERROR", e.message, 500);
  }
}
