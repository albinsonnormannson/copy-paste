import { NextResponse } from "next/server";
import { localDB, remoteDB } from "../utilities/prisma-clients";

export async function POST(request: Request) {
  const body = await request.json();

  const item = await localDB.clipboardItem.create({
    data: body,
  });
  return NextResponse.json(item);
}
