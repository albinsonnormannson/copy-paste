import { datasource } from "../../../utils/datasource"

export const getClipboardItems = async () => {
    const clipboardItems = await datasource((prisma) => {
        return prisma.clipboardItem.findMany({
            orderBy: {
                id: 'desc'
            }
        });
    });
    return clipboardItems;
}

export const addNewClipboardItem = async (content: string) => {
    const newClipboardItem = await datasource((prisma) => {
        return prisma.clipboardItem.create({
          data: {
            content
          },
        });
      });
      return newClipboardItem;
}

export const deleteClipboardItem = async (id: number) => {
  const deleted = await datasource((prisma) => {
    return prisma.clipboardItem.delete({
      where: {
        id,
      },
    });
  });
  return deleted;
}