import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Login} from "../models/login.model";
import {LoginResponse} from "../models/login-response.model";

@Injectable({
  providedIn: 'root'
})
export class AuthSecurityService {

  securityURL = environment.baseURL.concat('/auth/')

  httpOptions = { headers: new HttpHeaders({'Content-Type' : 'application/json'})};

  constructor(private httpClient: HttpClient) { }

  public login(loginPayload: Login): Observable<LoginResponse> {
    return this.httpClient.post<any>(this.securityURL + 'login', loginPayload, this.httpOptions);
  }

}
