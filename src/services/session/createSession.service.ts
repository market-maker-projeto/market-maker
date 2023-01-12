import { User } from "./../../entities/user.entity";
import jwt from "jsonwebtoken";
import { AppError } from "./../../errors/AppError";
import AppDataSource from "../../data-source";
import { IUserLogin } from "./../../interfaces/users.interfaces";
import { compare } from "bcryptjs";

export const createSessionService = async (userData: IUserLogin) => {
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({
    username: userData.username,
  });

  if (!user) {
    throw new AppError("Wrong email/password.", 403);
  }

  const matchPassword = await compare(userData.password, user.password);

  if (!matchPassword) {
    throw new AppError("Wrong email/password.", 403);
  }

  const token = jwt.sign(
    { username: userData.username },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
      subject: user.id,
    }
  );

  return token;
};
