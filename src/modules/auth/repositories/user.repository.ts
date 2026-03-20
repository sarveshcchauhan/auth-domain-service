//Repository only handles database operations.
import { UserModel } from "../models/user.model";

export class UserRepository {

  async findByEmail(email: string) {
    return UserModel.findOne({ email });
  }

  async create(data: any) {
    return UserModel.create(data);
  }

  async delete(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

}