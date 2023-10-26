export class Login {

  id?: number;
  login: string | undefined;
  password?: string | undefined;
  role?: string | undefined;

  constructor(id?: number, login?: string, password?: string, role?: string) {
    this.id = id;
    this.login = login;
    this.password = password;
    this.role = role;
  }

}
