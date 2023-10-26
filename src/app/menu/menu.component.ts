import {Component, Input, OnInit} from '@angular/core';
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    protected readonly sessionStorage = sessionStorage;

    @Input() isLogged: boolean | undefined;
    @Input() isAdmin: boolean | undefined;
    @Input() username: string | undefined;
    @Input() param: string | undefined
    @Input() token: string | undefined

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {   }

  ngOnInit(): void {
    debugger
    this.messageService.getMessage().subscribe( res => {
        this.username = res[`text`];
      },
      err => console.log(err));
  }

  public login():void {
    this.router.navigate(['/login']);
  }

  public logout():void {
    sessionStorage.clear()
    this.router.navigate(['/login']);
  }

}
