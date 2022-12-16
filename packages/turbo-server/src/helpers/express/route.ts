import Method from '@mathemon/turbo-common/http/method.js';
import { ValidationError as MappedValidationError } from '@mathemon/turbo-common/rest/error.js';
import { Handler, NextFunction, Request, Response, Router } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { Middleware, ValidationError } from 'express-validator/src/base.js';
import { MongoServerError } from 'mongodb';

import {
  BaseHttpException,
  ClientErrorBadRequest,
  ClientErrorConflict,
  ServerErrorInternalServerError,
} from '../httpError.js';

export type RequestWith<T, F extends string> = Request & {
  [key in F]: T;
};

type CustomHandler<Req extends Request = Request, Res extends Response = Response> = (
  req: Req,
  res: Res,
  next: NextFunction,
) => Promise<void> | void;

type CustomValidationError = {
  field: string;
  message: string;
};

const flattenNestedErrors = (errors: ValidationError[]): ValidationError[] => {
  const flattenedErrors: ValidationError[] = [];

  for (const error of errors) {
    if (error.nestedErrors) {
      flattenedErrors.push(...flattenNestedErrors(error.nestedErrors as ValidationError[]));
    } else {
      flattenedErrors.push(error);
    }
  }

  return flattenedErrors;
};

const errorNormalizer = (
  error: ValidationError,
): CustomValidationError | CustomValidationError[] => {
  if (error.nestedErrors) {
    return flattenNestedErrors(error.nestedErrors as ValidationError[]).map(
      errorNormalizer,
    ) as CustomValidationError[];
  }
  return {
    field: error.param,
    message: error.msg,
  };
};

const validationErrors = validationResult.withDefaults({
  formatter: errorNormalizer,
});

const errorMapper = (
  errors: (CustomValidationError | CustomValidationError[])[],
): MappedValidationError => {
  return errors.flat().reduce((acc, curr) => {
    if (curr.field === '_error') {
      const currentMessages = acc[curr.field] ?? [];
      return {
        ...acc,
        [curr.field]: currentMessages.includes(curr.message)
          ? currentMessages
          : [...currentMessages, curr.message],
      };
    } else {
      const currentMessages = acc[curr.field] ?? [];
      return {
        ...acc,
        [curr.field]: currentMessages.includes(curr.message)
          ? currentMessages
          : [...currentMessages, curr.message],
      };
    }
  }, {} as MappedValidationError);
};

const handler =
  <Req extends Request = Request, Res extends Response = Response>(
    insecureHandler: CustomHandler<Req, Res>,
  ) =>
  async (req: Req, res: Res, next: NextFunction) => {
    try {
      const errors = validationErrors(req);

      if (!errors.isEmpty()) {
        return next(new ClientErrorBadRequest(errorMapper(errors.array())));
      }

      return await insecureHandler(req, res, next);
    } catch (err) {
      if (err instanceof BaseHttpException) {
        return next(err);
        // Duplicate key error
      } else if (err instanceof MongoServerError && err.code === 11000) {
        return next(new ClientErrorConflict());
      }

      return next(new ServerErrorInternalServerError(err instanceof Error ? err : undefined));
    }
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isValidationChain = (h: any): h is ValidationChain | ValidationChain[] => {
  return Array.isArray(h) || h.builder !== undefined;
};

const methodFactory =
  (method: Method) =>
  <Req extends Request = Request, Res extends Response = Response>(
    router: Router,
    path: string,
    ...middleWare: (
      | CustomHandler<Req, Res>
      | ValidationChain
      | Middleware
      | (ValidationChain | Middleware)[]
    )[]
  ) => {
    router[method](
      path,
      ...(middleWare as Handler[]).map((h) => (isValidationChain(h) ? h : handler(h))),
    );
  };

export const getRoute = methodFactory(Method.GET);
export const postRoute = methodFactory(Method.POST);
export const putRoute = methodFactory(Method.PUT);
export const patchRoute = methodFactory(Method.PATCH);
export const deleteRoute = methodFactory(Method.DELETE);
export const optionsRoute = methodFactory(Method.OPTIONS);
export const headRoute = methodFactory(Method.HEAD);
