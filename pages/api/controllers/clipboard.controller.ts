import { db } from "../../../utils/datasource";
import { remoteDB } from "../../../utils/remoteDB";

export const getClipboardItems = async () => {
  const clipboardItems = await db.execute((prisma) => {
    return prisma.clipboardItem.findMany({
      orderBy: {
        id: "desc",
      },
    });
  });
  return clipboardItems;
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

export const deleteClipboardItem = async (id: number) => {
  const deleted = await db.execute((prisma) => {
    return prisma.clipboardItem.delete({
      where: {
        id,
      },
    });
  });
  return deleted;
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