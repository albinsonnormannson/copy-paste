import { Prisma } from "@prisma/client";
import { localDB, remoteDB } from "../utilities/prisma-clients";
import { ClipboardItem } from "@/types";

export const getClipboardItems = async () => {
  /* Prisma code */
  const clipboardItems = await localDB.clipboardItem.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return clipboardItems;
  //
  /* Drizzle code */
  // const clipboardItems: ClipboardItemType[] = await drizzleDB
  //   .select()
  //   .from(ClipboardItemTable);
  // return clipboardItems;
};

export const addNewClipboardItem = async (content: string) => {
  const newClipboardItem = await localDB.clipboardItem.create({
    data: {
      content,
      remote: false,
    },
  });
  return newClipboardItem;
};

// export const deleteClipboardItem = async (id: number) => {
//   const deleted = await db.execute((prisma) => {
//     return prisma.clipboardItem.deleteMany({
//       where: {
//         id,
//         remote: false,
//       },
//     });
//   });
//   return deleted;
// };

export const updateClipboardItem = async (
  id: number,
  dataToUpdate: Partial<Omit<ClipboardItem, "id" | "createdAt" | "updatedAt">>
) => {
  const updatedItem = await localDB.clipboardItem.update({
    where: {
      id,
    },
    data: {
      ...dataToUpdate,
    },
  });
  return updatedItem;
};

export const getRemoteClipboardItems = async () => {
  const clipboardItems = await remoteDB.clipboardItem.findMany({
    orderBy: {
      id: "desc",
    },
  });
  return clipboardItems;
};

export const addNewRemoteClipboardItem = async (content: string) => {
  const newClipboardItem = await remoteDB.clipboardItem.create({
    data: {
      content,
      remote: true,
    },
  });
  return newClipboardItem;
};

export const deleteClipboardItem = async (id: number) => {
  let constraints: Prisma.ClipboardItemDeleteManyArgs = {
    where: {
      id,
      remote: false,
    },
  };
  const deletedClipboardItem = await localDB.clipboardItem.findFirstOrThrow(
    constraints
  );

  await localDB.clipboardItem.deleteMany(constraints);
  return deletedClipboardItem;
};

export const deleteRemoteClipboardItem = async (id: number) => {
  let constraints: Prisma.ClipboardItemDeleteManyArgs = {
    where: {
      id,
      remote: true,
    },
  };
  const deletedClipboardItem = await remoteDB.clipboardItem.findFirstOrThrow(
    constraints
  );

  await remoteDB.clipboardItem.deleteMany(constraints);
  return deletedClipboardItem;
};

export const updateRemoteClipboardItem = async (
  id: number,
  dataToUpdate: Partial<Omit<ClipboardItem, "id" | "createdAt" | "updatedAt">>
) => {
  const updatedItem = await remoteDB.clipboardItem.update({
    where: {
      id,
    },
    data: {
      ...dataToUpdate,
    },
  });
  return updatedItem;
};

// Typings exportr
export type deleteRemoteClipboardItemReturnType = ReturnType<
  typeof deleteClipboardItem
>;

export const getCombinedClipboardItems = async () => {
  // Checking if the server is local
  let errorMessages: Array<{ message: any; comment?: string }> = [];
  let combinedResponse: ClipboardItem[] = [];
  const server = process.env.SERVER;
  if (server === "local") {
    try {
      const result = await getClipboardItems();

      combinedResponse = combinedResponse.concat(result);
    } catch (e) {
      errorMessages.push({
        message: e,
        comment: "Failed to retrieve local data",
      });
    }
  }
  try {
    const remoteResult = await getRemoteClipboardItems();
    combinedResponse = combinedResponse.concat(remoteResult);
  } catch (e) {
    errorMessages.push({
      message: e,
      comment: "Failed to retrieve remote data...",
    });
  }

  combinedResponse.sort((a, b) => {
    if (a.updatedAt > b.updatedAt) {
      return 1;
    }
    return -1;
  });
  return combinedResponse;
};
