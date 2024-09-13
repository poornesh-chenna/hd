import { UnAuthorizedError } from "../CustomErrors/UnAuthorizedError";
import { verifyTokenAndGetUserId } from "../utils/jwt";
import { Request, Response, NextFunction } from "express";

interface CustomRequest extends Request {
  userId?: string;
}

export const authorizeUser = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    throw new UnAuthorizedError(); 
  }

  try {
    const userId = verifyTokenAndGetUserId(token); // Verifying token and extracting user ID
    req.userId = userId; 
    next();
  } catch (err) {
    throw new UnAuthorizedError(); 
  }
};
