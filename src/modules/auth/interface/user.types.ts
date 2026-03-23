export class User {
  constructor(
    readonly first_name: string,
    readonly last_name: string,
    readonly email: string,
    readonly password: string,
    readonly role: string | "user",
    readonly id: string,
  ) {}

  static fromDocument(doc: any): User {
    return new User(
      doc.first_name,
      doc.last_name,
      doc.email,
      doc.password,
      doc.role,
      doc._id?.toString()
    );
  }
}