//Repository only handles database operations.
import { IUserRepository } from "../interface/user.repository.interface";
import { User } from "../interface/user.types";
import { UserModel } from "../models/user.model";

export class UserRepository implements IUserRepository{

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email });

    if (!doc) return null;

    return User.fromDocument(doc);
  }

  async create(data: User): Promise<User> {
    const doc = await UserModel.create(data);

    return User.fromDocument(doc);
  }

  async deleteById(id: string): Promise<User | null> {
    const doc = await UserModel.findByIdAndDelete(id);

    if (!doc) return null;

    return User.fromDocument(doc);
  }


}