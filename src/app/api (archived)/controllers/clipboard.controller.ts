import { ClipboardItem, Prisma } from "@prisma/client";
import {
  ClipboardItemTable,
  ClipboardItemType,
  drizzleDB,
} from "../../../drizzle-orm/schema";
import { db, remoteDB } from "../../../utils/datasource";

export const getClipboardItems = async () => {
  return null;
  /* Prisma code */
  const clipboardItems = await db.execute((prisma) => {
    return prisma.clipboardItem.findMany({
      orderBy: {
        id: "desc",
      },
    });
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
  const newClipboardItem = await db.execute((prisma) => {
    return prisma.clipboardItem.create({
      data: {
        content,
      },
    });
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
  dataToUpdate: Partial<ClipboardItem>
) => {
  const updatedItem = await db.execute((prisma) => {
    return prisma.clipboardItem.update({
      where: {
        id,
      },
      data: {
        ...dataToUpdate,
      },
    });
  });
  return updatedItem;
};

export const getRemoteClipboardItems = async () => {
  const clipboardItems = await remoteDB.execute((prisma) => {
    return prisma.clipboardItem.findMany({
      orderBy: {
        id: "desc",
      },
    });
  });

  return clipboardItems;
};

export const addNewRemoteClipboardItem = async (content: string) => {
  const newClipboardItem = await remoteDB.execute((prisma) => {
    return prisma.clipboardItem.create({
      data: {
        content,
        remote: true,
      },
    });
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
  const deletedClipboardItem = await db.execute((prisma) => {
    return prisma.clipboardItem.findFirstOrThrow(constraints);
  });

  db.execute((prisma) => {
    return prisma.clipboardItem.deleteMany(constraints);
  });
  return deletedClipboardItem;
};

export const deleteRemoteClipboardItem = async (id: number) => {
  let constraints: Prisma.ClipboardItemDeleteManyArgs = {
    where: {
      id,
      remote: true,
    },
  };
  const deletedClipboardItem = await remoteDB.execute((prisma) => {
    return prisma.clipboardItem.findFirstOrThrow(constraints);
  });

  remoteDB.execute((prisma) => {
    return prisma.clipboardItem.deleteMany(constraints);
  });
  return deletedClipboardItem;
};

export const updateRemoteClipboardItem = async (
  id: number,
  dataToUpdate: Partial<ClipboardItem>
) => {
  const updatedItem = await db.execute((prisma) => {
    return prisma.clipboardItem.update({
      where: {
        id,
      },
      data: {
        ...dataToUpdate,
      },
    });
  });
  return updatedItem;
};

// Typings exportr
export type deleteRemoteClipboardItemReturnType = ReturnType<
  typeof deleteClipboardItem
>;
