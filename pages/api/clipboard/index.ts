import type { ClipboardItem } from "@prisma/client";
import { NextApiHandler } from "next";
import {
  addNewClipboardItem,
  getClipboardItems,
  getRemoteClipboardItems,
} from "../controllers/clipboard.controller";

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      // Checking if the server is local
      let combinedResponse: ClipboardItem[] = [];
      if (req.socket.remoteAddress !== req.socket.localAddress) {
        const result = await getRemoteClipboardItems();
        combinedResponse = combinedResponse.concat(result);
      } else {
        const localResult = await getClipboardItems();
        combinedResponse = combinedResponse.concat(localResult);

        const remoteResult = await getRemoteClipboardItems();
        combinedResponse = combinedResponse.concat(remoteResult);
      }
      res.json(combinedResponse);
      break;
    case "POST":
      const { content } = req.body;
      const newClipboardItem = await addNewClipboardItem(content);
      res.json(newClipboardItem);
  }
};

export default handler;
