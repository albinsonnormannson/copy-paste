import { PrismaClient, PrismaPromise } from "@prisma/client";

// export type PrismaDatasource<T> =  (prismaClient: PrismaClient,
//     callback: (prismaClient: PrismaClient) => T) =>
export const datasource = async <T>(
  callback: (prismaClient: PrismaClient) => T | void
) => {
  const prismaClient = new PrismaClient();

  const promise = new Promise((resolve, reject) => {
    try {
      const result = callback(prismaClient);
      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
  await prismaClient.$disconnect();
  return promise as T;
};

export class Datasource {
  prismaClient = new PrismaClient();

  constructor(prismaClient?: PrismaClient) {
    if (prismaClient instanceof PrismaClient) {
      this.prismaClient = prismaClient;
    }
  }

  async execute<T>(callback: (prismaClient: PrismaClient) => T) {
    const promise = new Promise((resolve, reject) => {
      try {
        const result = callback(this.prismaClient);
        resolve(result);
      } catch (e) {
        reject(e);
      }
      this.prismaClient.$disconnect();
    });
    return promise as T;
  }

  async getDefaultDatasource() {
    return new Datasource();
  }
}

const db = new Datasource();
export { db };
