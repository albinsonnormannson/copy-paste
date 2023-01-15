// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { ClipboardItem } from "../../components/ClipboardItem";
import { remoteDB } from "../../utils/datasource";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // res.status(200).json({ name: "John Doe" });
  // const result = await ds.execute((prisma) => {
  //   return prisma.clipboardItem.findMany();
  // });
  // res.json(result);

  // if (req.connection.localAddress) {

  // }
  // res.json([req.socket.remoteAddress, req.socket.localAddress, req.headers]);
  // const remoteItems = RemoteDatasource.getDefaultRemoteDatasource().execute(
  //   (prisma) => {
  //     return prisma.clipboardItem.findMany();
  //   }
  // );
  // res.json(remoteItems);
  const item: ClipboardItem = req.body;

  const addedItems = await remoteDB.execute((prisma) => {
    return prisma.clipboardItem.create({
      data: {
        content: "dfdf",
        remote: true,
      },
    });
  });
  res.json(addedItems);
}
