import { Prisma } from "@prisma/client";
import { NextApiHandler, NextApiRequest } from "next";
import { datasource } from "../../../utils/datasource";
import {
  deleteClipboardItem,
  deleteRemoteClipboardItem,
} from "../controllers/clipboard.controller";

type DeleteApiRequest = NextApiRequest & {
  // req.query: string
};

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "DELETE":
      const { id, remote } = req.query;
      if (id == "undefined") {
        return;
      }
      try {
        let deleted;
        if (remote) {
          deleted = await deleteRemoteClipboardItem(Number(id));
        } else {
          deleted = await deleteClipboardItem(Number(id));
        }
        res.json(deleted);
      } catch (e: any) {
        res.status(404).json({ message: e.meta?.cause, remote });
      }
      break;
  }
};

export default handler;
