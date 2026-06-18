import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Inventory from "@/models/Inventory";
import StockMovement from "@/models/StockMovement";
import PurchaseOrder from "@/models/PurchaseOrder";
import { ok, requireAuth } from "@/lib/api";

export async function GET() {
  const auth = await requireAuth();
  if (auth.response) return auth.response;
  await connectDB();

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [totalProducts, valuationAgg, lowStockCount, openPOCount, movementsByDay, stockByWarehouse, topProducts] =
    await Promise.all([
      Product.countDocuments({ status: "ACTIVE" }),
      Inventory.aggregate([
        { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "p" } },
        { $unwind: "$p" },
        { $group: { _id: null, value: { $sum: { $multiply: ["$quantityOnHand", "$p.unitCost"] } } } },
      ]),
      Inventory.countDocuments({ $expr: { $lte: ["$quantityOnHand", "$reorderPoint"] } }),
      PurchaseOrder.countDocuments({ status: { $in: ["DRAFT", "SUBMITTED", "APPROVED", "PARTIAL"] } }),
      StockMovement.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, type: "$type" },
            count: { $sum: "$quantity" },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]),
      Inventory.aggregate([
        { $lookup: { from: "warehouses", localField: "warehouse", foreignField: "_id", as: "w" } },
        { $unwind: "$w" },
        { $group: { _id: "$w.code", quantity: { $sum: "$quantityOnHand" } } },
        { $sort: { quantity: -1 } },
      ]),
      Inventory.aggregate([
        { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "p" } },
        { $unwind: "$p" },
        { $group: { _id: "$p.name", value: { $sum: { $multiply: ["$quantityOnHand", "$p.unitCost"] } } } },
        { $sort: { value: -1 } },
        { $limit: 5 },
      ]),
    ]);

  return ok({
    totalProducts,
    totalStockValue: valuationAgg[0]?.value || 0,
    lowStockCount,
    openPOCount,
    movementsByDay,
    stockByWarehouse: stockByWarehouse.map((s: any) => ({ warehouse: s._id, quantity: s.quantity })),
    topProductsByValue: topProducts.map((p: any) => ({ name: p._id, value: p.value })),
  });
}
