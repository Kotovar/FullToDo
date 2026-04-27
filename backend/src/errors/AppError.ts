import type { StatusResponseEnum } from '@sharedCommon/schemas';

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode: StatusResponseEnum = 500,
    name?: string,
  ) {
    super(message);
    this.name = name ?? this.constructor.name;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NotFoundError');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'ConflictError');
  }
}
export class ForbiddenError extends AppError {
  constructor(message: string) {
    super(message, 403, 'ForbiddenError');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string) {
    super(message, 401, 'UnauthorizedError');
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429, 'TooManyRequestsError');
  }
}
