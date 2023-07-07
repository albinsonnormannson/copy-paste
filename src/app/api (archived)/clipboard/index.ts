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
import {
  isCustomError,
  isPrismaClientKnownRequestError,
} from "../../../utils/assertions";
import {
  BadRequest,
  InternalServerError,
  NotFoundResponse,
} from "../../../utils/errors";
import { debug } from "console";

const handler: NextApiHandler = async (req, res) => {
  const server = process.env.SERVER;
  switch (req.method) {
    case "GET":
      // Checking if the server is local
      let errorMessages: Array<{ message: any; comment?: string }> = [];
      try {
        let combinedResponse: ClipboardItem[] = [];
        if (server === "local") {
          try {
            const result = await getClipboardItems();
            // console.log("result", result);
            // TODO: UNCOMMENT
            // combinedResponse = combinedResponse.concat(result);
          } catch (e) {
            errorMessages.push({
              message: e,
              comment: "Failed to retrieve local data",
            });
          }
        }
        try {
          const remoteResult = await getRemoteClipboardItems();
          combinedResponse = combinedResponse.concat(remoteResult);
        } catch (e) {
          errorMessages.push({
            message: e,
            comment: "Failed to retrieve remote data...",
          });
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
          InternalServerError(res, e.meta?.cause);
        }
        InternalServerError(res, e);
      }
      break;
    case "POST":
      const { content } = req.body;
      try {
        // If server is not local, just add the clipboard item to the remote database
        if (server !== "local") {
          const newClipboardItem = await addNewRemoteClipboardItem(content);
          return res.json(newClipboardItem);
        } else {
          // Else check if online, and then put in remote database if true or local database if false
          if (await isOnline()) {
            const newClipboardItem = await addNewRemoteClipboardItem(content);
            res.json(newClipboardItem);
          } else {
            const newClipboardItem = await addNewClipboardItem(content);
            res.json(newClipboardItem);
          }
        }
      } catch (e) {
        console.log(e);
        if (e && e instanceof PrismaClientKnownRequestError) {
          InternalServerError(res, e.meta?.cause);
        }
        InternalServerError(res, e);
      }
      break;
    case "DELETE":
      {
        const { id, remote }: Pick<ClipboardItem, "id" | "remote"> = req.body;

        if (id == undefined) {
          return BadRequest(res, "Bad request.. ID is required");
        }
        try {
          let deleted: Awaited<ReturnType<typeof deleteClipboardItem>>;

          if (remote) {
            deleted = await deleteRemoteClipboardItem(id);
          } else {
            deleted = await deleteClipboardItem(id);
          }

          res.json(deleted);
        } catch (e) {
          if (isPrismaClientKnownRequestError(e)) {
            return NotFoundResponse(res, e.meta?.cause);
          }
          if (isCustomError(e)) {
            return NotFoundResponse(res, e.message);
          }
          return InternalServerError(res, e);
        }
      }
      break;
    case "PUT": {
      const {
        id,
        remote,
        ...dataToUpdate
      }: Partial<ClipboardItem> & Pick<ClipboardItem, "id" | "remote"> =
        req.body;
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
          InternalServerError(res, e.meta?.cause);
        }
      }
    }
  }
};

export default handler;
