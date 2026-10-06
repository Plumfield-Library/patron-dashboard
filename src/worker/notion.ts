import { Client, isFullPage } from "@notionhq/client";
import { Context } from "hono";
import { Bindings, Classes, IllTitle, User } from "../types";

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
                equals: user.email,
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
  async getAllInterLibraryLoan(user: User) {
    try {
      const resp = await this.#client.dataSources.query({
        data_source_id: "6d8ab6d5-2427-4aed-a5c1-bdfec13a9ae9",
        filter: {
          property: "Email",
          email: {
            equals: user.email,
          },
        },
        filter_properties: ["Title", "Location", "Status"],
      });
      const titles: IllTitle[] = [];
      resp.results.forEach((ill) => {
        if (!isFullPage(ill)) {
          console.error(`Title: ${ill.id} is invalid`);
          console.error(JSON.stringify(ill));
          return;
        }

        const properties = ill.properties;
        if (properties["Title"].type != "title") {
          console.error("Title is invalid for", ill.id);
          return;
        }
        if (properties["Location"].type != "select") {
          console.error("Location is invalid for", ill.id);
          return;
        }
        if (properties["Status"].type != "status") {
          console.error("Status is invalid for", ill.id);
          return;
        }

        let status = properties["Status"].status?.name;
        let location = properties["Location"].select?.name;
        const title = properties["Title"].title[0].plain_text;
        const inProcess = ["Books Pulled", "Prepared", "Checked Out"];
        const patronStatus = [
          "Request Received",
          "In Process",
          "Delivered",
          "Advanced Hold",
        ];
        if (
          !status ||
          (!inProcess.includes(status) && !patronStatus.includes(status))
        ) {
          status = "Request Received";
        } else if (inProcess.includes(status)) {
          status = "In Process";
        } else if (status == "Delivered") {
          status = "Available";
        }
        if (!location || !["Main", "Shire"].includes(location)) {
          location = "Main";
        }
        titles.push({
          title,
          status,
          location,
        });
      });

      return titles;
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
