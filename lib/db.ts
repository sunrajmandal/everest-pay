import { PGlite } from "@electric-sql/pglite";
import path from "path";
import fs from "fs";

// Initialize PGlite with persistence
const dbPath = path.resolve(process.cwd(), "./pgdata");
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

declare global {
  var db: PGlite | undefined;
}

export const db = global.db || new PGlite(dbPath);

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}

// Initialize schema
export async function initSchema() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS "Customer" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT UNIQUE NOT NULL,
      "name" TEXT,
      "phone" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Service" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT UNIQUE NOT NULL,
      "description" TEXT,
      "price" DOUBLE PRECISION NOT NULL,
      "costPrice" DOUBLE PRECISION,
      "category" TEXT,
      "icon" TEXT,
      "isActive" BOOLEAN DEFAULT TRUE,
      "sortOrder" INTEGER DEFAULT 0,
      "durations" JSONB,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Ensure durations column exists in Service
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Service' AND column_name='durations') THEN
        ALTER TABLE "Service" ADD COLUMN "durations" JSONB;
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "Order" (
      "id" TEXT PRIMARY KEY,
      "orderNumber" TEXT UNIQUE NOT NULL,
      "customerId" TEXT NOT NULL,
      "serviceId" TEXT NOT NULL,
      "amount" DOUBLE PRECISION NOT NULL,
      "duration" TEXT DEFAULT '1 Month',
      "paymentMethod" TEXT NOT NULL,
      "paymentStatus" TEXT DEFAULT 'pending',
      "transactionId" TEXT,
      "paymentDetails" JSONB,
      "khaltiPidx" TEXT,
      "esewaTransactionUuid" TEXT,
      "activationStatus" TEXT DEFAULT 'pending',
      "deliveryOption" TEXT DEFAULT 'ready_made',
      "providedAccountEmail" TEXT,
      "providedAccountPassword" TEXT,
      "externalAccountEmail" TEXT,
      "externalAccountPassword" TEXT,
      "activationNotes" TEXT,
      "startDate" TIMESTAMP,
      "endDate" TIMESTAMP,
      "reminderSent" BOOLEAN DEFAULT FALSE,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("customerId") REFERENCES "Customer"("id"),
      FOREIGN KEY ("serviceId") REFERENCES "Service"("id")
    );

    -- Ensure duration column exists in Order
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='duration') THEN
        ALTER TABLE "Order" ADD COLUMN "duration" TEXT DEFAULT '1 Month';
      END IF;
    END $$;

    -- Ensure delivery fields exist
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='deliveryOption') THEN
        ALTER TABLE "Order" ADD COLUMN "deliveryOption" TEXT DEFAULT 'ready_made';
        ALTER TABLE "Order" ADD COLUMN "providedAccountEmail" TEXT;
        ALTER TABLE "Order" ADD COLUMN "providedAccountPassword" TEXT;
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "Admin" (
      "id" TEXT PRIMARY KEY,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL,
      "name" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Setting" (
      "id" TEXT PRIMARY KEY,
      "key" TEXT UNIQUE NOT NULL,
      "value" TEXT NOT NULL,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "EmailLog" (
      "id" TEXT PRIMARY KEY,
      "to" TEXT NOT NULL,
      "subject" TEXT NOT NULL,
      "body" TEXT NOT NULL,
      "orderId" TEXT,
      "status" TEXT NOT NULL,
      "error" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS "Coupon" (
      "id" TEXT PRIMARY KEY,
      "code" TEXT UNIQUE NOT NULL,
      "type" TEXT NOT NULL,
      "value" DOUBLE PRECISION NOT NULL,
      "expiryDate" TIMESTAMP,
      "usageLimit" INTEGER,
      "usageCount" INTEGER DEFAULT 0,
      "isActive" BOOLEAN DEFAULT TRUE,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

// Helper for upsert
async function handleUpsert(table: string, whereKey: string, whereVal: any, update: any, create: any) {
  const existing = await db.query(`SELECT * FROM "${table}" WHERE "${whereKey}" = $1`, [whereVal]);
  if (existing.rows.length > 0) {
    const updateData = { ...update };
    delete (updateData as any).id; // NEVER update the ID as it breaks foreign keys
    const updateKeys = Object.keys(updateData);
    if (updateKeys.length === 0) return existing.rows[0];
    const fields = updateKeys.map((k, i) => `"${k}" = $${i + 2}`).join(", ");
    const values = Object.values(updateData);
    const res = await db.query(`UPDATE "${table}" SET ${fields} WHERE "${whereKey}" = $1 RETURNING *`, [whereVal, ...values]);
    return res.rows[0];
  } else {
    const data = { ...create };
    if (!data.id) data.id = `${table[0].toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`;
    const keys = Object.keys(data).map(k => `"${k}"`).join(", ");
    const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(", ");
    const values = Object.values(data);
    const res = await db.query(`INSERT INTO "${table}" (${keys}) VALUES (${placeholders}) RETURNING *`, values);
    return res.rows[0];
  }
}

// Simple Prisma-like wrapper for convenience
export const prismaMock: any = {
  coupon: {
    findMany: async () => {
      const res = await db.query('SELECT * FROM "Coupon" ORDER BY "createdAt" DESC');
      return res.rows;
    },
    findUnique: async ({ where }: any) => {
      const res = await db.query('SELECT * FROM "Coupon" WHERE "code" = $1', [where.code]);
      return res.rows[0] || null;
    },
    create: async ({ data }: any) => {
      const id = `c_${Math.random().toString(36).substr(2, 9)}`;
      const keys = ["id", ...Object.keys(data)].map(k => `"${k}"`).join(", ");
      const placeholders = ["id", ...Object.keys(data)].map((_, i) => `$${i + 1}`).join(", ");
      const values = [id, ...Object.values(data)];
      const res = await db.query(`INSERT INTO "Coupon" (${keys}) VALUES (${placeholders}) RETURNING *`, values);
      return res.rows[0];
    },
    update: async ({ where, data }: any) => {
      const fields = Object.keys(data).map((k, i) => `"${k}" = $${i + 2}`).join(", ");
      const values = Object.values(data);
      const res = await db.query(`UPDATE "Coupon" SET ${fields} WHERE "id" = $1 RETURNING *`, [where.id, ...values]);
      return res.rows[0];
    },
    delete: async ({ where }: any) => {
      await db.query('DELETE FROM "Coupon" WHERE "id" = $1', [where.id]);
      return { success: true };
    }
  },
  customer: {
    findUnique: async ({ where }: any) => {
      const res = await db.query('SELECT * FROM "Customer" WHERE "email" = $1', [where.email]);
      return res.rows[0] || null;
    },
    upsert: async ({ where, update, create }: any) => handleUpsert("Customer", "email", where.email, update, create),
    count: async () => {
      const res = await db.query('SELECT COUNT(*) FROM "Customer"');
      return parseInt((res.rows[0] as any).count);
    }
  },
  service: {
    findMany: async ({ where, orderBy }: any) => {
      let query = 'SELECT * FROM "Service"';
      const values: any[] = [];
      if (where?.isActive !== undefined) {
        query += ' WHERE "isActive" = $1';
        values.push(where.isActive);
      }
      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const dir = orderBy[field].toUpperCase();
        query += ` ORDER BY "${field}" ${dir}`;
      }
      const res = await db.query(query, values);
      return res.rows;
    },
    findUnique: async ({ where }: any) => {
      const res = await db.query('SELECT * FROM "Service" WHERE "id" = $1', [where.id]);
      return res.rows[0] || null;
    },
    upsert: async ({ where, update, create }: any) => handleUpsert("Service", "name", where.name, update, create)
  },
  order: {
    create: async ({ data, include }: any) => {
      const id = `o_${Math.random().toString(36).substr(2, 9)}`;
      const keys = ["id", ...Object.keys(data)].map(k => `"${k}"`).join(", ");
      const placeholders = ["id", ...Object.keys(data)].map((_, i) => `$${i + 1}`).join(", ");
      const values = [id, ...Object.values(data)];
      const res = await db.query(`INSERT INTO "Order" (${keys}) VALUES (${placeholders}) RETURNING *`, values);
      const order: any = res.rows[0];
      if (include?.service) {
        order.service = await prismaMock.service.findUnique({ where: { id: order.serviceId } });
      }
      return order;
    },
    findUnique: async ({ where, include }: any) => {
      let query = 'SELECT * FROM "Order"';
      let values: any[] = [];
      if (where.id) {
        query += ' WHERE "id" = $1';
        values = [where.id];
      } else if (where.esewaTransactionUuid) {
        query += ' WHERE "esewaTransactionUuid" = $1';
        values = [where.esewaTransactionUuid];
      } else if (where.khaltiPidx) {
        query += ' WHERE "khaltiPidx" = $1';
        values = [where.khaltiPidx];
      }
      
      const res = await db.query(query, values);
      const order: any = res.rows[0] || null;
      if (order && include?.service) {
        order.service = await prismaMock.service.findUnique({ where: { id: order.serviceId } });
      }
      if (order && include?.customer) {
        const cRes = await db.query('SELECT * FROM "Customer" WHERE "id" = $1', [order.customerId]);
        order.customer = cRes.rows[0];
      }
      return order;
    },
    findFirst: async ({ where, include }: any) => {
      return prismaMock.order.findUnique({ where, include });
    },
    update: async ({ where, data }: any) => {
      const fields = Object.keys(data).map((k, i) => `"${k}" = $${i + 2}`).join(", ");
      const values = Object.values(data);
      const res = await db.query(`UPDATE "Order" SET ${fields} WHERE "id" = $1 RETURNING *`, [where.id, ...values]);
      return res.rows[0];
    },
    findMany: async ({ where, include, orderBy, take }: any) => {
      let query = 'SELECT * FROM "Order"';
      const values: any[] = [];
      const conditions: string[] = [];

      if (where?.activationStatus) {
        conditions.push(`"activationStatus" = $${values.length + 1}`);
        values.push(where.activationStatus);
      }
      if (where?.paymentStatus) {
        conditions.push(`"paymentStatus" = $${values.length + 1}`);
        values.push(where.paymentStatus);
      }
      if (where?.createdAt?.gte) {
        conditions.push(`"createdAt" >= $${values.length + 1}`);
        values.push(where.createdAt.gte);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }

      if (orderBy) {
        const field = Object.keys(orderBy)[0];
        const dir = orderBy[field].toUpperCase();
        query += ` ORDER BY "${field}" ${dir}`;
      }

      if (take) {
        query += ` LIMIT ${take}`;
      }

      const res = await db.query(query, values);
      const orders = res.rows;
      for (const order of orders as any[]) {
        if (include?.service) {
          order.service = await prismaMock.service.findUnique({ where: { id: order.serviceId } });
        }
        if (include?.customer) {
          const cRes = await db.query('SELECT * FROM "Customer" WHERE "id" = $1', [order.customerId]);
          order.customer = cRes.rows[0];
        }
      }
      return orders;
    },
    count: async ({ where }: any = {}) => {
      let query = 'SELECT COUNT(*) FROM "Order"';
      const values: any[] = [];
      const conditions: string[] = [];
      
      if (where?.paymentStatus) {
        conditions.push(`"paymentStatus" = $${values.length + 1}`);
        values.push(where.paymentStatus);
      }
      if (where?.activationStatus) {
        conditions.push(`"activationStatus" = $${values.length + 1}`);
        values.push(where.activationStatus);
      }
      if (where?.endDate?.lte) {
        conditions.push(`"endDate" <= $${values.length + 1}`);
        values.push(where.endDate.lte);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      const res = await db.query(query, values);
      return parseInt((res.rows[0] as any).count);
    },
    aggregate: async ({ where, _sum }: any) => {
      if (_sum?.amount) {
        let query = 'SELECT SUM("amount") as total FROM "Order"';
        const values: any[] = [];
        if (where?.paymentStatus) {
          query += ' WHERE "paymentStatus" = $1';
          values.push(where.paymentStatus);
        }
        const res = await db.query(query, values);
        return { _sum: { amount: parseFloat((res.rows[0] as any).total || 0) } };
      }
      return { _sum: { amount: 0 } };
    }
  },
  admin: {
    findMany: async () => {
      const res = await db.query('SELECT * FROM "Admin" ORDER BY "createdAt" DESC');
      return res.rows;
    },
    findUnique: async ({ where }: any) => {
      const res = await db.query('SELECT * FROM "Admin" WHERE "email" = $1', [where.email]);
      return res.rows[0] || null;
    },
    create: async ({ data }: any) => {
      const id = `a_${Math.random().toString(36).substr(2, 9)}`;
      const keys = ["id", ...Object.keys(data)].map(k => `"${k}"`).join(", ");
      const placeholders = ["id", ...Object.keys(data)].map((_, i) => `$${i + 1}`).join(", ");
      const values = [id, ...Object.values(data)];
      const res = await db.query(`INSERT INTO "Admin" (${keys}) VALUES (${placeholders}) RETURNING *`, values);
      return res.rows[0];
    },
    update: async ({ where, data }: any) => {
      const fields = Object.keys(data).map((k, i) => `"${k}" = $${i + 2}`).join(", ");
      const values = Object.values(data);
      const res = await db.query(`UPDATE "Admin" SET ${fields} WHERE "id" = $1 RETURNING *`, [where.id, ...values]);
      return res.rows[0];
    },
    delete: async ({ where }: any) => {
      await db.query('DELETE FROM "Admin" WHERE "id" = $1', [where.id]);
      return { success: true };
    },
    upsert: async ({ where, update, create }: any) => handleUpsert("Admin", "email", where.email, update, create)
  },
  setting: {
    upsert: async ({ where, update, create }: any) => handleUpsert("Setting", "key", where.key, update, create)
  },
  emailLog: {
    create: async ({ data }: any) => {
      const id = `el_${Math.random().toString(36).substr(2, 9)}`;
      const keys = ["id", ...Object.keys(data)].map(k => `"${k}"`).join(", ");
      const placeholders = ["id", ...Object.keys(data)].map((_, i) => `$${i + 1}`).join(", ");
      const values = [id, ...Object.values(data)];
      const res = await db.query(`INSERT INTO "EmailLog" (${keys}) VALUES (${placeholders}) RETURNING *`, values);
      return res.rows[0];
    }
  },
  $disconnect: async () => {
    // No-op for mock
  }
};

export default prismaMock;
