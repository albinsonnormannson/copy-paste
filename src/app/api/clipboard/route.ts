import { NextResponse } from "next/server";
import { localDB } from "../utilities/prisma-clients";
import { ClipboardItem } from "@/types";
import {
  addNewClipboardItem,
  addNewRemoteClipboardItem,
  deleteClipboardItem,
  deleteRemoteClipboardItem,
  getClipboardItems,
  getCombinedClipboardItems,
  getRemoteClipboardItems,
  updateClipboardItem,
  updateRemoteClipboardItem,
} from "./utilities";
import { DefaultErrorResponse } from "../lib/helpers";
import isOnline from "is-online";
import CustomError, { BadRequestError, NotFoundError } from "../lib/errors";
import {
  isCustomError,
  isPrismaClientKnownRequestError,
} from "../utilities/assertions";

export async function GET(request: Request) {
  try {
    const clipboardItems = await getCombinedClipboardItems();
    return NextResponse.json(clipboardItems);
  } catch (e) {
    if (e instanceof Error) {
      return DefaultErrorResponse(e);
    }
  }
}

export async function POST(request: Request) {
  const server = process.env.SERVER;
  const body: Pick<ClipboardItem, "content"> = await request.json();

  const { content } = body;
  try {
    // If server is not local, just add the clipboard item to the remote database
    if (server !== "local") {
      const newClipboardItem = await addNewRemoteClipboardItem(content);
      return NextResponse.json(newClipboardItem);
    } else {
      // Else check if online, and then put in remote database if true or local database if false
      if (await isOnline()) {
        const newClipboardItem = await addNewRemoteClipboardItem(content);
        return NextResponse.json(newClipboardItem);
      } else {
        const newClipboardItem = await addNewClipboardItem(content);
        return NextResponse.json(newClipboardItem);
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      return DefaultErrorResponse(e);
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const body: Pick<ClipboardItem, "id" | "remote"> = await request.json();
    const id = Number(body.id);
    const remote = Boolean(body.remote);

    if (id == undefined) {
      throw new BadRequestError("Bad request.. ID is required");
    }
    try {
      let deleted: Awaited<ReturnType<typeof deleteClipboardItem>>;

      if (remote) {
        deleted = await deleteRemoteClipboardItem(id);
      } else {
        deleted = await deleteClipboardItem(id);
      }

      return NextResponse.json(deleted);
    } catch (e) {
      if (e instanceof Error) {
        if (isPrismaClientKnownRequestError(e)) {
          throw new NotFoundError(e.message);
        }
        if (isCustomError(e)) {
          throw new NotFoundError(e.message);
        }
      }
      throw new CustomError("Something went wrong");
    }
  } catch (e) {
    return DefaultErrorResponse(e);
  }
}

export async function PUT(request: Request) {
  const body: Partial<ClipboardItem> & Pick<ClipboardItem, "id" | "remote"> =
    await request.json();
  const itemId = Number(body.id);
  const isRemote = Boolean(body.remote);
  const { id, remote, ...dataToUpdate } = body;
  try {
    if (remote) {
      const updatedItems = await updateRemoteClipboardItem(
        itemId,
        dataToUpdate
      );
      return NextResponse.json(updatedItems);
    } else {
      const updatedItems = await updateClipboardItem(Number(id), dataToUpdate);
      return NextResponse.json(updatedItems);
    }
  } catch (e) {
    return DefaultErrorResponse(e);
  }
}
