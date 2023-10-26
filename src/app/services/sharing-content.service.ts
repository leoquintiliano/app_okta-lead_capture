import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {MessageService} from "./message.service";

@Injectable({
  providedIn: 'root'
})
export class SharingContentService {

  public id: number | undefined;

  public isAdmin: boolean | undefined

  public isLogged: boolean | undefined

  public isEdition: boolean | undefined

  public isInsertion: boolean | undefined

  public sourceClick: string | undefined

  public username: string | undefined

  public token: string | undefined

  veiculoUrl = 'http://localhost:8090/veiculo/';

  modeloUrl = 'http://localhost:8090/modelo/';

  anoVeiculoUrl = 'http://localhost:8090/ano-veiculo/';

  httpOptions = { headers: new HttpHeaders({'Content-Type' : 'application/json'})};

  estoqueId: number | undefined;

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  setId = (id: number) => {
    this.id = id
  }

  public getMessageEvent() {
    this.messageService.getMessage().subscribe( res => {
      this.username = res[`text`];
    },err => console.log(err));
  }



}
