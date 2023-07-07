import { BadRequest } from "@/utils/errors";
import {
  deleteClipboardItem,
  deleteRemoteClipboardItem,
} from "../../controllers/clipboard.controller";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const body = await request.json();
  const remote: string = body.remote;
  if (id == undefined) {
    return BadRequest("ID is required");
  }
  try {
    let deleted;
    if (remote) {
      deleted = await deleteRemoteClipboardItem(Number(id));
    } else {
      deleted = await deleteClipboardItem(Number(id));
    }
    return NextResponse.json(deleted);
  } catch (e: any) {
    return NextResponse.json(
      { message: e.meta?.cause, remote },
      { status: 404 }
    );
  }
};
