import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  return res
    .status(err.customStatus || StatusCodes.INTERNAL_SERVER_ERROR)
    .send({
      message:
        err.customMessage ||
        "Непредвиденная ошибка. Попробуйте повторить запрос.",
    });
}
