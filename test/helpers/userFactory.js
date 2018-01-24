import bcrypt from 'bcrypt';
import { UserModel } from '../../models/user';

export class UserFactory {
  static async createUsers() {
    return await UserModel.insertMany(
      [
        EXISTING_USER_LIST.EXISTING_USER_1,
        EXISTING_USER_LIST.EXISTING_USER_2
      ]
    )
  }
}

export const EXISTING_USER_LIST = {
  EXISTING_USER_1: {
    email: "existing@gmail.com",
    hash_password: bcrypt.hashSync("password", 10),
    password: "password",
    firstName: "existing",
    lastName: "userOne"
  },
  EXISTING_USER_2: {
    email: "existingUserTwo@gmail.com",
    hash_password: bcrypt.hashSync("password", 10),
    password: "password",
    firstName: "existingTwo",
    lastName: "userTwo"
  }
}