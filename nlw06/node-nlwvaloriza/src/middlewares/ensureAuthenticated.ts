import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken'

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  const authtoken = req.headers.authorization;

  if (!authtoken) {
    return res.status(401).json({
      message: 'Authentication token missing'
    });
  }

  const token = authtoken.split(' ')[1];

  try {
    const { sub } = verify(token, 'ce550b379bd3ac708c86ef0bb46adeda') as IPayload;

    req.user_id = sub;

    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Authentication token is invalid'
    });
  }
}