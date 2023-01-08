// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { remoteDB } from "../../utils/remoteDB";

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
  res.json([req.socket.remoteAddress, req.socket.localAddress, req.headers]);
}
