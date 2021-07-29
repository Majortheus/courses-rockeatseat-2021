import { getCustomRepository } from "typeorm";

import { compare } from "bcryptjs"
import { sign} from "jsonwebtoken"

import { UsersRepositories } from "../repositories/UsersRepositories";

interface IAuthenticateRequest {
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest): Promise<string> {
    const usersRepositories = getCustomRepository(UsersRepositories);

    //verify email exists
    const user = await usersRepositories.findOne({ email });
    if (!user) {
      throw new Error("Email/Password incorrect");
    }

    //verify password is correct
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("Email/Password incorrect");
    }

    //create token
    const token = sign({
      email: user.email,
    }, "ce550b379bd3ac708c86ef0bb46adeda", {
      subject: user.id,
      expiresIn: "1d"
    });
    
    return token;
  }
}

export { AuthenticateUserService };