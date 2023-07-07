import { NextResponse } from "next/server";
import CustomError from "./errors";
import { isPrismaClientKnownRequestError } from "../utilities/assertions";

export const DefaultErrorResponse = async function (e: unknown) {
  console.log(e);
  if (e instanceof Error) {
    const errorResponse: { message: string; stack?: any } = {
      message: e.message,
    };
    if (process.env.NODE_ENV !== "production") {
      errorResponse.stack = e.stack;
    }
    if (e instanceof CustomError) {
      return NextResponse.json(errorResponse, { status: e.statusCode });
    } else if (isPrismaClientKnownRequestError(e)) {
      errorResponse.message = e.meta?.cause;
      return NextResponse.json(errorResponse, { status: 500 });
    } else {
      if (process.env.NODE_ENV === "production") {
        errorResponse.message = "Something went wrong";
      }
      return NextResponse.json(errorResponse, { status: 500 });
    }
  } else {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
};
