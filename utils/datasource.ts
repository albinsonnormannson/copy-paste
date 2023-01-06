import { PrismaClient, PrismaPromise } from "@prisma/client";
import { rejects } from "assert";

// export type PrismaDatasource<T> =  (prismaClient: PrismaClient,
//     callback: (prismaClient: PrismaClient) => T) =>
export const datasource = async <T>(
  callback: (prismaClient: PrismaClient) => PrismaPromise<T> | void
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
  return promise;
};
