type MappedValidationError = { [key: string]: string[] };

enum StatusCode {
  SuccessOK = 200,
  SuccessCreated = 201,
  SuccessNoContent = 204,
  SuccessPartialContent = 206,
  ClientErrorBadRequest = 400,
  ClientErrorUnauthorized = 401,
  ClientErrorPaymentRequired = 402,
  ClientErrorForbidden = 403,
  ClientErrorNotFound = 404,
  ClientErrorMethodNotAllowed = 405,
  ClientErrorConflict = 409,
  ClientErrorUnsupportedMediaType = 415,
  ServerErrorInternalServerError = 500,
  ServerErrorNotImplemented = 501,
}

export abstract class BaseHttpException<T = never> extends Error {
  protected metaValue: T | undefined;

  protected constructor(
    public readonly statusCode: number,
    public readonly message: string,
    ...rest: T extends never ? [] : [T]
  ) {
    super(message);
    if (rest.length === 1) {
      this.metaValue = rest[0];
    }
  }

  get meta(): T extends never ? undefined : T {
    return this.metaValue as T extends never ? undefined : T;
  }
}

interface HttpExceptionInstance<T = never> {
  get meta(): T extends never ? undefined : T;
  statusCode: number;
  message: string;
}

export interface HttpException<T = never> {
  new (..._params: T extends never ? [] : [T]): HttpExceptionInstance<T>;
}

const generateHttpStatusCodeError = <FT = never>(
  statusCode: StatusCode,
  defaultMessage: string,
): HttpException<FT> =>
  class StatusCodeError<T = FT> extends BaseHttpException<T> {
    constructor(...params: T extends never ? [] : [T]) {
      super(statusCode, defaultMessage, ...params);
      if (params.length === 1) {
        this.metaValue = params[0];
      }
    }
  };

export const ClientErrorBadRequest = generateHttpStatusCodeError<MappedValidationError>(
  StatusCode.ClientErrorBadRequest,
  'Bad Request',
);

export const ClientErrorUnauthorized = generateHttpStatusCodeError(
  StatusCode.ClientErrorUnauthorized,
  'Unauthorized',
);

export const ClientErrorPaymentRequired = generateHttpStatusCodeError(
  StatusCode.ClientErrorPaymentRequired,
  'Payment Required',
);

export const ClientErrorForbidden = generateHttpStatusCodeError(
  StatusCode.ClientErrorForbidden,
  'Forbidden',
);

export const ClientErrorNotFound = generateHttpStatusCodeError(
  StatusCode.ClientErrorNotFound,
  'Not Found',
);

export const ClientErrorMethodNotAllowed = generateHttpStatusCodeError(
  StatusCode.ClientErrorMethodNotAllowed,
  'Method Not Allowed',
);

export const ClientErrorConflict = generateHttpStatusCodeError(
  StatusCode.ClientErrorConflict,
  'Conflict',
);

export const ClientErrorUnsupportedMediaType = generateHttpStatusCodeError(
  StatusCode.ClientErrorUnsupportedMediaType,
  'Unsupported Media Type',
);

export const ServerErrorInternalServerError = generateHttpStatusCodeError<Error | undefined>(
  StatusCode.ServerErrorInternalServerError,
  'Internal Server Error',
) as unknown as HttpException<Error | undefined>;

export const ServerErrorNotImplemented = generateHttpStatusCodeError(
  StatusCode.ServerErrorNotImplemented,
  'Not Implemented',
);
