import type { ClipboardItem } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { NextApiHandler } from "next";
import isOnline from "is-online";

import {
  addNewClipboardItem,
  addNewRemoteClipboardItem,
  deleteClipboardItem,
  deleteRemoteClipboardItem,
  getClipboardItems,
  getRemoteClipboardItems,
  updateClipboardItem,
  updateRemoteClipboardItem,
} from "../controllers/clipboard.controller";
import { isPrismaClientKnownRequestError } from "../../../utils/assertions";

const handler: NextApiHandler = async (req, res) => {
  const server = process.env.SERVER;
  switch (req.method) {
    case "GET":
      // Checking if the server is local
      let errorMessages: Array<{ message: any; comment?: string }> = [];
      try {
        let combinedResponse: ClipboardItem[] = [];
        if (server !== "local") {
          const result = await getRemoteClipboardItems();
          combinedResponse = combinedResponse.concat(result);
        } else {
          const localResult = await getClipboardItems();
          combinedResponse = combinedResponse.concat(localResult);

          try {
            const remoteResult = await getRemoteClipboardItems();
            combinedResponse = combinedResponse.concat(remoteResult);
          } catch (e) {
            errorMessages.push({
              message: e,
              comment: "Failed to retrieve remote data...",
            });
          }
        }
        combinedResponse.sort((a, b) => {
          if (a.updatedAt > b.updatedAt) {
            return 1;
          }
          return -1;
        });
        res.json(combinedResponse);
      } catch (e) {
        if (e && e instanceof PrismaClientKnownRequestError) {
          return res.status(500).json({ message: e.meta?.cause });
        }
        res.status(500).json({ message: e });
      }
      break;
    case "POST":
      const { content } = req.body;
      try {
        if (server !== "local") {
          const newClipboardItem = await addNewRemoteClipboardItem(content);
          return res.json(newClipboardItem);
        } else {
          if (await isOnline()) {
            const newClipboardItem = await addNewRemoteClipboardItem(content);
            res.json(newClipboardItem);
          } else {
            const newClipboardItem = await addNewClipboardItem(content);
            res.json(newClipboardItem);
          }
        }
      } catch (e) {
        if (e && e instanceof PrismaClientKnownRequestError) {
          return res.status(500).json({ message: e.meta?.cause });
        }
        res.status(500).json({ message: e });
      }
      break;
    case "DELETE":
      {
        const { id, remote } = req.body;
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
        } catch (e) {
          if (isPrismaClientKnownRequestError(e)) {
            return res.status(404).json({ message: e.meta?.cause, remote });
          }
          return res.status(500).json({ message: e });
        }
      }
      break;
    case "PUT": {
      const { id, remote, ...dataToUpdate } = req.body;
      if (!id) {
        return res
          .status(400)
          .json({ message: "ID of item to update is required" });
      }
      try {
        if (remote) {
          const updatedItems = await updateRemoteClipboardItem(
            id,
            dataToUpdate
          );
          res.json(updatedItems);
        } else {
          const updatedItems = await updateClipboardItem(id, dataToUpdate);
          res.json(updatedItems);
        }
      } catch (e) {
        if (isPrismaClientKnownRequestError(e)) {
          res.status(500).json({ message: e.meta?.cause });
        }
      }
    }
  }
};

export default handler;
