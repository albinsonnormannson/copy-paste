import { PrismaClientKnownRequestError as LocalPrismaClientKnownRequestError } from "@prisma/client/local/runtime/library";
import { PrismaClientKnownRequestError as RemotePrismaClientKnownRequestError } from "@prisma/client/remote/runtime/library";

const isPrismaClientKnownRequestError = (
  error: any
): error is
  | LocalPrismaClientKnownRequestError
  | RemotePrismaClientKnownRequestError => {
  return (
    error instanceof LocalPrismaClientKnownRequestError ||
    error instanceof RemotePrismaClientKnownRequestError
  );
};

const isCustomError = (error: any): error is Error => {
  return error instanceof Error;
};

export { isPrismaClientKnownRequestError, isCustomError };
