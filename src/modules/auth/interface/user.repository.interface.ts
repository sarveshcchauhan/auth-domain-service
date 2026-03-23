// user.repository.interface.ts

import { User } from "./user.types";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: User): Promise<User>;
  deleteById(id: string): Promise<User | null>;
}