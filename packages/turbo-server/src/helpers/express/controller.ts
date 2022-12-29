import { NextFunction, Response } from 'express';

import { RequestWith, RequestWithBody } from './route.js';

export type ControllerRequest<ReqBody, ReqExtra extends object> = RequestWithBody<ReqBody> &
  ReqExtra extends never
  ? RequestWithBody<ReqBody>
  : RequestWith<ReqExtra>;

export type ControllerResponse<ResBody> = Response<ResBody>;

export type Controller<ReqBody, ResBody, ReqExtra extends object = never> = (
  req: ControllerRequest<ReqBody, ReqExtra>,
  res: ControllerResponse<ResBody>,
  next: NextFunction,
) => Promise<void> | void;

export default <ReqBody, ResBody, ReqExtra extends object = never>(
  controller: Controller<ReqBody, ResBody, ReqExtra>,
) => controller;
