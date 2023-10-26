import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment-prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Municipio} from "../models/municipio.model";
import {Estado} from "../models/estado.model";

@Injectable({
  providedIn: 'root'
})
export class LocalizacaoService {

  baseUrl = environment.baseURL

  localizacaoUrl = this.baseUrl.concat('/localizacao/')

  httpOptions = { headers: new HttpHeaders({'Content-Type' : 'application/json'})};

  constructor(private httpClient: HttpClient ) { }

  public listUFs(): Observable<Estado[]> {
    return this.httpClient.get<Estado[]>(this.localizacaoUrl.concat('uf'), this.httpOptions);
  }

  public listMunicipios(idUF: number | undefined): Observable<Municipio[]> {
    return this.httpClient.get<Municipio[]>(this.localizacaoUrl.concat(`municipios/${idUF}`), this.httpOptions);
  }

}
