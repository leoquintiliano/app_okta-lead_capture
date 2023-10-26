import { UsuariosService } from './../services/usuarios.service';
import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthSecurityService} from "../services/auth-security.service";
import {Login} from "../models/login.model";
import {SharingContentService} from "../services/sharing-content.service";
import {LoginResponse} from "../models/login-response.model";
import moment from "moment-timezone"
import {AlertService} from "../services/alert.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: string | undefined;
  email: string | undefined;
  password: string | undefined;
  loginPayload: Login = new Login()

  @Input() isLogged: boolean | undefined;
  @Input() isAdmin: boolean | undefined;
  @Input() username: string | undefined;

  constructor(private userService: UsuariosService,
              private authService: AuthSecurityService,
              private router: Router,
              private sharedService: SharingContentService,
              private alertService: AlertService) { }

  ngOnInit(): void {
  }

  login(): void {
    debugger
    this.loginPayload.login = this.user
    this.loginPayload.password = this.password

    this.authService.login(this.loginPayload).subscribe( data => {
      this.username = data.username?.toUpperCase()
      this.validateAdmin(data)
      this.setToken(data.token) //new Date().toISOString()
      sessionStorage.setItem('creationDate',moment().hours().toString())
      sessionStorage.setItem('creationDate', new Date().getHours().toString())
      this.router.navigate(['/']);
      this.alertService.showAlertWithTimer('Bem vindo, ' + this.username)
    }, (error) => {
      this.alertService.error('Usuário ou senha inválidos!')
    })
  }

  validateAdmin(data: LoginResponse) {
    this.isAdmin = data.username !== undefined && data.username.toUpperCase() === 'ADMIN' || data.username?.toUpperCase() === 'ROLE_ADMIN' ? true : false
    this.isAdmin = data.authorities?.includes('ADMIN') || data.authorities?.includes('ROLE_ADMIN')
    sessionStorage.setItem('isAdmin', this.isAdmin ? 'ADMIN' : 'USER')
  }

  setToken(token: string | undefined) {
    this.sharedService.token = token
    if (typeof token === "string") {
      sessionStorage.setItem('token', token)
    }
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

}
