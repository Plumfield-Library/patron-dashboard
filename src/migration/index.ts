import * as dotenv from "dotenv";
import * as path from "path";
import { connect } from "@tursodatabase/serverless";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.dev.vars") });

async function main() {
  const apiKey = process.env.TURSO_KEY;
  const apiURL = process.env.TURSO_URL;
  if (!apiKey || !apiURL) {
    throw new Error("TURSO_KEY and TURSO_URL must be configured");
  }
  const conn = connect({
    authToken: apiKey,
    url: apiURL,
  });
  const res = await conn.prepare("SELECT email FROM main.patrons");
  const rows = (await res.all()).map((r) => String(r.email).toLowerCase());
  const emailMap: Array<[id: string, email: string]> = [];
  const records = parse(
    readFileSync(
      path.resolve(import.meta.dirname, "unified_customers.csv"),
      "utf8",
    ),
    {
      columns: true, // first row becomes keys -> array of objects
      skip_empty_lines: true,
      trim: true,
      bom: true, // strips the BOM Excel/Google exports often add
    },
  ) as Array<Record<string, string>>;
  // console.log(JSON.stringify(records));
  rows.forEach((em: string) => {
    const stripeObj = records.filter((r) => r["Email"].toLowerCase() == em);
    if (stripeObj.length == 0) {
      console.log(`No stripe id for email: ${em}`);
      return;
    }
    const custId = stripeObj[0].id;
    const cust = [custId, em];
    emailMap.push(cust as [id: string, email: string]);
  });
  console.log(emailMap);
  await conn.batch(
    emailMap.map(([id, email]) => ({
      sql: "UPDATE main.patrons SET stripe_id = ? WHERE email = ?",
      args: [id, email],
    })),
    "write",
  );
}
main();
