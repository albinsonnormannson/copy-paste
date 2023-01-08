import { PrismaClient } from "@prisma/client";
import { Datasource } from "./datasource";

const remoteDB = new Datasource(
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.REMOTE_DATABASE_URL,
      },
    },
  })
);

export { remoteDB };
