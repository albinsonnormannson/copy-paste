import { PrismaClient as RemoteDB } from "@prisma/client/remote";
import { PrismaClient as LocalDB } from "@prisma/client/local";

export const remoteDB = new RemoteDB({
  datasources: {
    db: {
      url: process.env.REMOTE_DATABASE_URL,
    },
  },
});

export const localDB = new LocalDB({
  datasources: {
    db: {
      url: process.env.LOCAL_DATABASE_URL,
    },
  },
});
