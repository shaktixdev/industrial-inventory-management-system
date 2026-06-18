/**
 * Seed script: creates an admin user plus demo catalog, warehouses, suppliers,
 * inventory and movements. Run with: npm run seed
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../src/models/User";
import Category from "../src/models/Category";
import Product from "../src/models/Product";
import Warehouse from "../src/models/Warehouse";
import Supplier from "../src/models/Supplier";
import Inventory from "../src/models/Inventory";
import StockMovement from "../src/models/StockMovement";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri);
  console.log("Connected. Seeding…");

  // Clear categories and drop problematic indexes
  await Category.collection.deleteMany({});
  try {
    await Category.collection.dropIndex("slug_1");
  } catch (e) {
    // Index may not exist, ignore
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@iims.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  // Admin user
  const passwordHash = await bcrypt.hash(adminPass, 10);
  await User.updateOne(
    { email: adminEmail.toLowerCase() },
    { $set: { name: "Administrator", email: adminEmail.toLowerCase(), passwordHash, role: "ADMIN", isActive: true } },
    { upsert: true }
  );
  console.log(`Admin user: ${adminEmail} / ${adminPass}`);

  // Categories
  const [bearings, fasteners, electrical] = await Promise.all([
    Category.findOneAndUpdate({ name: "Bearings" }, { name: "Bearings" }, { upsert: true, new: true }),
    Category.findOneAndUpdate({ name: "Fasteners" }, { name: "Fasteners" }, { upsert: true, new: true }),
    Category.findOneAndUpdate({ name: "Electrical" }, { name: "Electrical" }, { upsert: true, new: true }),
  ]);

  // Products
  const productDefs = [
    { sku: "BRG-6204", name: "Ball Bearing 6204", category: bearings._id, unitCost: 1.25, unitPrice: 2.5, reorderPoint: 100, reorderQuantity: 500 },
    { sku: "BRG-6205", name: "Ball Bearing 6205", category: bearings._id, unitCost: 1.6, unitPrice: 3.2, reorderPoint: 80, reorderQuantity: 400 },
    { sku: "FST-M8X40", name: "Hex Bolt M8x40", category: fasteners._id, unitCost: 0.08, unitPrice: 0.2, reorderPoint: 1000, reorderQuantity: 5000 },
    { sku: "FST-NUT-M8", name: "Hex Nut M8", category: fasteners._id, unitCost: 0.03, unitPrice: 0.1, reorderPoint: 2000, reorderQuantity: 10000 },
    { sku: "ELC-CBL-2.5", name: "Power Cable 2.5mm (m)", category: electrical._id, unitOfMeasure: "M", unitCost: 0.45, unitPrice: 0.9, reorderPoint: 500, reorderQuantity: 2000 },
    { sku: "ELC-RLY-24V", name: "Relay 24V DPDT", category: electrical._id, unitCost: 3.1, unitPrice: 6.5, reorderPoint: 50, reorderQuantity: 200 },
  ];
  const products: any[] = [];
  for (const p of productDefs) {
    const doc = await Product.findOneAndUpdate({ sku: p.sku }, p, { upsert: true, new: true });
    products.push(doc);
  }

  // Warehouses
  const [whMain, whSouth] = await Promise.all([
    Warehouse.findOneAndUpdate({ code: "WH-MAIN" }, { code: "WH-MAIN", name: "Main Plant Warehouse", address: { city: "Detroit", country: "USA" }, zones: [{ code: "A", name: "Receiving", bins: ["A1", "A2"] }, { code: "B", name: "Bulk", bins: ["B1"] }] }, { upsert: true, new: true }),
    Warehouse.findOneAndUpdate({ code: "WH-SOUTH" }, { code: "WH-SOUTH", name: "South Distribution Center", address: { city: "Austin", country: "USA" }, zones: [{ code: "A", name: "Storage", bins: ["A1"] }] }, { upsert: true, new: true }),
  ]);

  // Suppliers
  await Promise.all([
    Supplier.findOneAndUpdate({ code: "SUP-ACME" }, { code: "SUP-ACME", name: "Acme Industrial Supply", email: "sales@acme.example", leadTimeDays: 5, rating: 4 }, { upsert: true }),
    Supplier.findOneAndUpdate({ code: "SUP-NORD" }, { code: "SUP-NORD", name: "Nordic Components AB", email: "orders@nordic.example", leadTimeDays: 10, rating: 5 }, { upsert: true }),
  ]);

  // Inventory + opening IN movements
  await Inventory.deleteMany({});
  await StockMovement.deleteMany({ reference: "OPENING" });
  for (const p of products) {
    const qtyMain = Math.floor(Math.random() * 800) + (p.reorderPoint || 0);
    const qtySouth = Math.floor(Math.random() * 300);
    await Inventory.create({ product: p._id, warehouse: whMain._id, quantityOnHand: qtyMain, reorderPoint: p.reorderPoint, bin: "A1" });
    await Inventory.create({ product: p._id, warehouse: whSouth._id, quantityOnHand: qtySouth, reorderPoint: Math.floor((p.reorderPoint || 0) / 2), bin: "A1" });
    await StockMovement.create({ type: "IN", product: p._id, quantity: qtyMain, toWarehouse: whMain._id, unitCost: p.unitCost, reference: "OPENING" });
    if (qtySouth > 0)
      await StockMovement.create({ type: "IN", product: p._id, quantity: qtySouth, toWarehouse: whSouth._id, unitCost: p.unitCost, reference: "OPENING" });
  }

  console.log(`Seeded ${products.length} products, 2 warehouses, 2 suppliers, inventory + movements.`);
  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
