interface CustomErrorOptions extends ErrorOptions {
  statusCode: number;
}

export default class CustomError extends Error {
  statusCode: number;
  constructor(
    message?: string | undefined,
    options?: CustomErrorOptions | undefined
  ) {
    super(message, options);
    this.statusCode = options?.statusCode || 500;
  }
}

export class NotFoundError extends CustomError {
  constructor(
    message?: string | undefined,
    options?: CustomErrorOptions | undefined
  ) {
    super(message, options);
    this.statusCode = 404;
  }
}

export class BadRequestError extends CustomError {
  constructor(
    message?: string | undefined,
    options?: CustomErrorOptions | undefined
  ) {
    super(message, options);
    this.statusCode = 400;
  }
}

export class UnauthorizedRequestError extends CustomError {
  constructor(
    message?: string | undefined,
    options?: CustomErrorOptions | undefined
  ) {
    super(message, options);
    this.statusCode = 401;
  }
}
