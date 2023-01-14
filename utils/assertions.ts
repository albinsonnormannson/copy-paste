import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaClientKnownRequestError as RemotePrismaClientKnownRequestError } from "../prisma-client/remote-prisma-client/runtime";


const isPrismaClientKnownRequestError = (error: any): error is PrismaClientKnownRequestError => {
    return error instanceof PrismaClientKnownRequestError;
}
const isRemotePrismaClientKnownRequestError = (error: any): error is RemotePrismaClientKnownRequestError => {
    return error instanceof RemotePrismaClientKnownRequestError;
}

export {isPrismaClientKnownRequestError, isRemotePrismaClientKnownRequestError}