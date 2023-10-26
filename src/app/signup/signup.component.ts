import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {User} from "../models/user.model";
import {UsuariosService} from "../services/usuarios.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  username: string | undefined;
  email: string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  password: string | undefined;
  role: string | undefined

  @Input() isLogged: boolean | undefined;
  @Input() isAdmin: boolean | undefined;
  @Input() token: string | undefined

  constructor(private userService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    const user = new User(this.username, this.email, this.firstName, this.lastName, this.password);
    this.userService.create(user).subscribe(
      data => {
        console.log(data);
        this.voltar();
      },
      err => console.log(err)
    );
  }

  voltar(): void {
    this.router.navigate(['/']);
  }

  private adjustMenuBarCss() {
    // @ts-ignore
    document.getElementById('general_menu_bar').className='navbar navbar-expand-xl navbar-dark bg-dark'
  }

}
