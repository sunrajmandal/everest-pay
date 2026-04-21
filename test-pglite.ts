import { PGlite } from "@electric-sql/pglite";

async function test() {
  try {
    const db = new PGlite(); // in-memory for test
    const res = await db.query("SELECT 1 as one");
    console.log("PGlite works!", res);
  } catch (err) {
    console.error("PGlite failed!", err);
  }
}

test();
