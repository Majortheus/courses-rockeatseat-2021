import { NextFunction, Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepositories } from "../repositories/UsersRepositories";

export async function ensureAdmin(req: Request, res: Response, next: NextFunction) {
  const { user_id } = req;

  const userRepositories = getCustomRepository(UsersRepositories);
  const user = await userRepositories.findOne(user_id);

  if (user.admin) {
    return next();
  }

  return res.status(401).json({
    error: 'Unauthorized'
  });
}