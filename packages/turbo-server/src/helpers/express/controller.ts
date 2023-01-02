import { NextFunction, Response } from 'express';

import { RequestWith, RequestWithBody, RequestWithMaybe } from './route.js';

export type ControllerRequest<
  ReqBody,
  ReqExtra extends object,
  ReqExtraOptional extends boolean,
> = RequestWithBody<ReqBody> &
  ([ReqExtra] extends [never]
    ? RequestWithBody<ReqBody>
    : ReqExtraOptional extends true
    ? RequestWithMaybe<ReqExtra>
    : RequestWith<ReqExtra>);

export type ControllerResponse<ResBody> = Response<ResBody>;

export type Controller<
  ReqBody,
  ResBody,
  ReqExtra extends object,
  ReqExtraOptional extends boolean,
> = (
  req: ControllerRequest<ReqBody, ReqExtra, ReqExtraOptional>,
  res: ControllerResponse<ResBody>,
  next: NextFunction,
) => Promise<void> | void;

export default <
  ReqBody,
  ResBody,
  ReqExtra extends object = never,
  ReqExtraOptional extends boolean = false,
>(
  controller: Controller<ReqBody, ResBody, ReqExtra, ReqExtraOptional>,
) => controller;
