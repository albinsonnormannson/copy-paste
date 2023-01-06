import { NextApiHandler } from "next";
import { addNewClipboardItem, getClipboardItems } from "../controllers/clipboard.controller";

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      const result = await getClipboardItems();
      res.json(result);
      break;
    case "POST":
      const { content } = req.body;
      const newClipboardItem = await addNewClipboardItem(content);
      res.json(newClipboardItem);
  }
};

export default handler;
