import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ok, fail, requireAuth, writeAudit } from "@/lib/api";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();
  const product = await Product.findById(params.id).populate("category", "name").lean();
  if (!product) return fail("NOT_FOUND", "Product not found", 404);
  return ok(product);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth("MANAGER");
  if (auth.response) return auth.response;
  await connectDB();
  const body = await req.json().catch(() => ({}));
  try {
    const product = await Product.findByIdAndUpdate(params.id, body, { new: true, runValidators: true });
    if (!product) return fail("NOT_FOUND", "Product not found", 404);
    await writeAudit(auth.user.id, "product.update", "products", params.id, `Updated product ${product.sku}`);
    return ok(product);
  } catch (e: any) {
    if (e.code === 11000) return fail("CONFLICT", "SKU or barcode already exists", 409);
    return fail("SERVER_ERROR", e.message, 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAuth("ADMIN");
  if (auth.response) return auth.response;
  await connectDB();
  const product = await Product.findByIdAndDelete(params.id);
  if (!product) return fail("NOT_FOUND", "Product not found", 404);
  await writeAudit(auth.user.id, "product.delete", "products", params.id, `Deleted product ${product.sku}`);
  return ok({ deleted: true });
}
