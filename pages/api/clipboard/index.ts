import type { ClipboardItem } from "@prisma/client";
import {
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime";
import { NextApiHandler } from "next";
import isOnline from "is-online";
import { PrismaClientKnownRequestError as RemotePrismaClientKnownRequestError } from "../../../prisma-client/remote-prisma-client/runtime";

import {
  addNewClipboardItem,
  addNewRemoteClipboardItem,
  deleteClipboardItem,
  deleteRemoteClipboardItem,
  getClipboardItems,
  getRemoteClipboardItems,
} from "../controllers/clipboard.controller";
import {
  isPrismaClientKnownRequestError,
  isRemotePrismaClientKnownRequestError,
} from "../../../utils/assertions";

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case "GET":
      // Checking if the server is local
      try {
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
        combinedResponse.sort((a, b) => {
          if (a.updatedAt > b.updatedAt) {
            return 1;
          }
          return -1;
        });
        res.json(combinedResponse);
      } catch (e) {
        if (
          e &&
          (e instanceof PrismaClientKnownRequestError ||
            e instanceof RemotePrismaClientKnownRequestError)
        ) {
          return res.status(500).json({ message: e.meta?.cause });
        }
        res.status(500).json({ message: e });
      }
      break;
    case "POST":
      const { content } = req.body;
      try {
        if (await isOnline()) {
          const newClipboardItem = await addNewRemoteClipboardItem(content);
          res.json(newClipboardItem);
        } else {
          const newClipboardItem = await addNewClipboardItem(content);
          res.json(newClipboardItem);
        }
      } catch (e) {
        if (
          e &&
          (e instanceof PrismaClientKnownRequestError ||
            e instanceof RemotePrismaClientKnownRequestError)
        ) {
          return res.status(500).json({ message: e.meta?.cause });
        }
        res.status(500).json({ message: e });
      }
    case "DELETE":
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
        if (
          isPrismaClientKnownRequestError(e) ||
          isRemotePrismaClientKnownRequestError(e)
        ) {
          return res.status(404).json({ message: e.meta?.cause, remote });
        }
        return res.status(500).json({ message: e });
      }
      break;
  }
};

export default handler;
