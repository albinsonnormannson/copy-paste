import { ClipboardItem } from "@prisma/client";
import { db, RemoteDatasource, remoteDB } from "../../../utils/datasource";

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
    return prisma.clipboardItem.deleteMany({
      where: {
        id,
        remote: false,
      },
    });
  });
  return deleted;
};

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

export const deleteRemoteClipboardItem = async (id: number) => {
  const deletedClipboardItem =
    await RemoteDatasource.getDefaultRemoteDatasource().execute((prisma) => {
      return prisma.clipboardItem.deleteMany({
        where: {
          id,
          remote: true,
        },
      });
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
