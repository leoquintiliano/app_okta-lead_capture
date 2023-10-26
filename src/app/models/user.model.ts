export class User {

  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  password: string | undefined;

  constructor(username: string | undefined, email: string | undefined, firstName: string | undefined, lastName: string | undefined, password: string | undefined) {
    this.username = username;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.password = password;
  }

}
