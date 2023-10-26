export class LoginResponse {

  id?: number;
  username: string | undefined;
  role?: string | undefined;
  token?: string | undefined
  authorities?: string[]

  constructor(id?: number, username?: string, token?: string, role?: string, authorities?: string[] ) {
    this.id = id;
    this.username = username;
    this.role = role;
    this.token = token
    this.authorities = authorities
  }

}
