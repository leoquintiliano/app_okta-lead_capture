import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {MessageService} from "../services/message.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username: string | undefined;

  isLogged: string | undefined

  constructor(private messageService: MessageService, private http: HttpClient) { }

  ngOnInit(): void {
    debugger
    this.messageService.getMessage().subscribe( res => {
        this.username = res[`text`];
      },
      err => console.log(err));
  }

}
