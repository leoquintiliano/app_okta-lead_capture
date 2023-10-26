import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../models/user.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  userURL = environment.baseURL.concat('/user/')

  httpOptions = { headers: new HttpHeaders({'Content-Type' : 'application/json'})};

  constructor(private httpClient: HttpClient) { }

  public create(user: User): Observable<any> {
    return this.httpClient.post<any>(this.userURL + 'create', user, this.httpOptions);
  }

}
