import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.issues,
    });
  }

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    message,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};
