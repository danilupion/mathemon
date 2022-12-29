import Method from '@mathemon/turbo-common/http/method.js';
import { ValidationError as MappedValidationError } from '@mathemon/turbo-common/rest/error.js';
import { Handler, NextFunction, Request, Router } from 'express';
import { ValidationChain, validationResult } from 'express-validator';
import { ValidationError } from 'express-validator/src/base.js';
import { MongoServerError } from 'mongodb';

import {
  BaseHttpException,
  ClientErrorBadRequest,
  ClientErrorConflict,
  ServerErrorInternalServerError,
} from '../httpError.js';

import { Controller, ControllerRequest, ControllerResponse } from './controller.js';

export type RequestWith<Fields extends object> = Request & Fields;

export type RequestWithBody<Value> = Omit<Request, 'body'> & {
  body: Value;
};

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

const secureHandler =
  <ReqBody, ResBody, ReqExtra extends object>(
    insecureHandler: Controller<ReqBody, ResBody, ReqExtra>,
  ) =>
  async (
    req: ControllerRequest<ReqBody, ReqExtra>,
    res: ControllerResponse<ResBody>,
    next: NextFunction,
  ) => {
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

type Middleware = ValidationChain | Handler | (ValidationChain | Handler)[];

const isValidationChain = (h: Middleware): h is ValidationChain | ValidationChain[] => {
  return Array.isArray(h) || (h as ValidationChain).builder !== undefined;
};

const methodFactory =
  (method: Method) =>
  <ReqBody, ResBody, ReqExtra extends object>(
    router: Router,
    path: string,
    ...middleWare: [...Middleware[], Controller<ReqBody, ResBody, ReqExtra>]
  ) => {
    router[method](
      path,
      ...(middleWare as Handler[]).map((m) => (isValidationChain(m) ? m : secureHandler(m))),
    );
  };

export const getRoute = methodFactory(Method.GET);
export const postRoute = methodFactory(Method.POST);
export const putRoute = methodFactory(Method.PUT);
export const patchRoute = methodFactory(Method.PATCH);
export const deleteRoute = methodFactory(Method.DELETE);
export const optionsRoute = methodFactory(Method.OPTIONS);
export const headRoute = methodFactory(Method.HEAD);
