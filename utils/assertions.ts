import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

const isPrismaClientKnownRequestError = (
  error: any
): error is PrismaClientKnownRequestError => {
  return error instanceof PrismaClientKnownRequestError;
};

export { isPrismaClientKnownRequestError };
