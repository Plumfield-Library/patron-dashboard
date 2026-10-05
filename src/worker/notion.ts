import { Client, isFullPage } from "@notionhq/client";
import { Context } from "hono";
import { Bindings, Classes, User } from "../types";

export class Notion {
  #client;
  constructor(
    c: Context<{ Bindings: Bindings; Variables: { jwtPayload: User } }>,
  ) {
    this.#client = new Client({
      auth: c.env.NOTION_KEY,
      dangerouslyAllowBrowser: true,
    });
  }

  async getAllClasses(user: User) {
    try {
      console.log("Class request for:", user.email);
      const resp = await this.#client.dataSources.query({
        data_source_id: "364c64a1-4d4e-8067-9b81-000bf4fc49e4",
        filter: {
          and: [
            {
              property: "Email",
              email: {
                equals: "apopp10@alumni.uwosh.edu",
              },
            },
            {
              property: "date_filter",
              rollup: {
                date: {
                  on_or_after: "today",
                },
              },
            },
          ],
        },
        filter_properties: [
          "Student",
          "date_rollup",
          "Type",
          "title_rollup",
          "location_rollup",
        ],
      });

      const classes: Classes[] = [];

      resp.results.forEach((cl) => {
        if (!isFullPage(cl)) {
          console.error(`Class ${cl.id} is not valid`);
          console.error(JSON.stringify(cl));
          return;
        }
        if (cl.properties["Student"].type != "title") {
          console.error("Title property is not valid");
          return;
        }
        if (
          cl.properties["date_rollup"].type != "rollup" ||
          cl.properties["date_rollup"].rollup.type != "array" ||
          cl.properties["date_rollup"].rollup.array[0].type != "date"
        ) {
          console.error("date_rollup property is not valid");
          console.error(JSON.stringify(cl.properties["date_rollup"]));
          return;
        }
        if (
          cl.properties["Type"].type != "rollup" ||
          cl.properties["Type"].rollup.type != "array" ||
          cl.properties["Type"].rollup.array[0].type != "select"
        ) {
          console.error("Type property is not valid");
          return;
        }
        if (
          cl.properties["title_rollup"].type != "rollup" ||
          cl.properties["title_rollup"].rollup.type != "array" ||
          cl.properties["title_rollup"].rollup.array[0].type != "title"
        ) {
          console.error("title_rollup property is not valid");
          return;
        }
        if (
          cl.properties["location_rollup"].type != "rollup" ||
          cl.properties["location_rollup"].rollup.type != "array" ||
          cl.properties["location_rollup"].rollup.array[0].type != "select"
        ) {
          console.error("location_rollup property is not valid");
          return;
        }
        const student = cl.properties["Student"].title[0].plain_text;
        const date =
          cl.properties["date_rollup"].rollup.array[0].date?.start ?? "";
        const type = cl.properties["Type"].rollup.array[0].select?.name ?? "";
        const title =
          cl.properties["title_rollup"].rollup.array[0].title[0].plain_text;
        const location =
          cl.properties["location_rollup"].rollup.array[0].select?.name;

        if (!date) {
          console.error("date is undefined");
          return;
        }
        if (!type) {
          console.error("type is undefined");
          return;
        }
        if (!location) {
          console.error("location is undefined");
          return;
        }
        classes.push({
          title,
          type,
          date,
          student,
          location,
          id: cl.id,
        });
      });
      return classes;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
