import { Prisma } from "@prisma/client";
import { NextApiHandler, NextApiRequest } from "next";
import { datasource } from "../../../utils/datasource";
import { deleteClipboardItem } from "../controllers/clipboard.controller";

type DeleteApiRequest = NextApiRequest & {
  // req.query: string
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "DELETE":
      const { id } = req.query;
      if (id == "undefined") {
        return;
      }
      try {
      const deleted = await deleteClipboardItem(Number(id));
      res.json(deleted);
    } catch (e: any) {
      res.status(404).json({message: e.meta?.cause})
    }
      break;
  }
};

export default handler;
