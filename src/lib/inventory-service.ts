import Inventory from "@/models/Inventory";
import mongoose from "mongoose";

/**
 * Atomically adjust on-hand quantity for a (product, warehouse) pair.
 * Creates the inventory record if it does not exist (upsert).
 */
export async function adjustStock(
  product: string,
  warehouse: string,
  delta: number,
  reorderPoint?: number
) {
  return Inventory.findOneAndUpdate(
    { product, warehouse },
    {
      $inc: { quantityOnHand: delta },
      ...(reorderPoint !== undefined ? { $setOnInsert: { reorderPoint } } : {}),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function getAvailable(product: string, warehouse: string): Promise<number> {
  const inv = await Inventory.findOne({ product, warehouse }).lean<any>();
  if (!inv) return 0;
  return Math.max(0, (inv.quantityOnHand || 0) - (inv.reserved || 0));
}
