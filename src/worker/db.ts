import type { Context } from "hono";
import { Bindings, PatronRow, User } from "../types";
import { connect } from "@tursodatabase/serverless";

export class Database {
  #conn;
  constructor(
    c: Context<{ Bindings: Bindings; Variables: { jwtPayload: User } }>,
  ) {
    this.#conn = connect({ url: c.env.TURSO_URL, authToken: c.env.TURSO_KEY });
  }
  async getUser(email: string): Promise<User | null> {
    const statement = await this.#conn.prepare(
      `SELECT email, name, membership_status, stripe_id, classes, visit, role
           FROM main.patrons WHERE email = ?`,
    );
    const row = await statement.get([email]);

    return row ? PatronRow.parse(row) : null;
  }
}
