import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment-prod";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Lead} from "../models/lead.model";

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  baseUrl = environment.baseURL

  leadUrl = this.baseUrl.concat('/lead/')

  httpOptions = { headers: new HttpHeaders({'Content-Type' : 'application/json'})};

  constructor(private httpClient: HttpClient ) { }

  public listLeads(): Observable<Lead[]> {
    return this.httpClient.get<Lead[]>(this.leadUrl.concat('list'), this.httpOptions);
  }

  public findLead(id: number | undefined): Observable<Lead> {
    return this.httpClient.get<Lead>(this.leadUrl.concat(`find/${id}`), this.httpOptions);
  }

  public findLeadsAfterFilterHasBeenApplied(filteredIds: number[]): Observable<Lead[]> {
    return this.httpClient.get<Lead[]>(this.leadUrl.concat(`findAfterFiltered/${filteredIds}`), this.httpOptions);
  }

  public findLeadByName(name: string | undefined): Observable<Lead[]> {
    return this.httpClient.get<Lead[]>(this.leadUrl.concat(`findByName/${name}`), this.httpOptions);
  }

  public save(lead: Lead): Observable<Lead> {
    return this.httpClient.post<Lead>(this.leadUrl + 'save', lead, this.httpOptions);
  }

  public update(lead: Lead): Observable<Lead> {
    debugger;
    if(lead.id !== undefined && lead.id !== null) {
      const url =`${this.leadUrl}update/${lead.id}`;
      return this.httpClient.put<Lead>(url,lead);
    }
    else {
      return this.save(lead);
    }
  }

  delete(id: number | undefined) {
    const url =`${this.leadUrl}delete/${id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: id
    };
    return this.httpClient.delete<Lead>(url,options);
  }

  findWithFilter(leadFilter: Lead): Observable<Lead[]> {
    debugger
    return this.httpClient.get<Lead[]>(this.leadUrl + 'findFiltered'.concat('/')
      .concat(this.composedFilter(leadFilter)),this.httpOptions)
  }

  public composedFilter = (filter: Lead) => {
    debugger
    let nome = filter.nome !== undefined ? filter.nome : '-'
    let primeiroContato = filter.primeiroContato !== undefined ? filter.primeiroContato : '-'
    let ultimoContato = filter.ultimoContato !== undefined ? filter.ultimoContato : '-'
    let dataNascimento = filter.dataNascimento !== undefined ? filter.dataNascimento : '-'
    let celular = filter.celular !== undefined ? filter.celular : '-'
    let telefone = filter.telefone !== undefined ? filter.telefone : '-'
    let uf = filter.uf !== undefined ? filter.uf : '-'
    let email = filter.email !== undefined ? filter.email : '-'
    let endereco = filter.endereco !== undefined ? filter.endereco : '-'
    let cidade = filter.cidade !== undefined ? filter.cidade : '-'
    let carroInteresse1 = filter.carroInteresse1 !== undefined ? filter.carroInteresse1 : '-'
    let carroInteresse2 = filter.carroInteresse2 !== undefined ? filter.carroInteresse2 : '-'
    let carroInteresse3 = filter.carroInteresse3 !== undefined ? filter.carroInteresse3 : '-'
    let carroAtual1 = filter.carroAtual1 !== undefined ? filter.carroAtual1 : '-'
    let carroAtual2 = filter.carroAtual2 !== undefined ? filter.carroAtual2 : '-'
    let carroAtual3 = filter.carroAtual3 !== undefined ? filter.carroAtual3 : '-'
    let vendedor = filter.vendedor !== undefined ? filter.vendedor : '-'
    let status = filter.status !== undefined ? filter.status : '-'
    let opcaoVeiculo = filter.opcaoVeiculo !== undefined ? filter.opcaoVeiculo : '-'
    let observacoes = filter.observacoes !== undefined ? filter.observacoes : '-'

    const path =  ''.concat('nome/primeiroContato/ultimoContato/dataNascimento/celular/telefone/email/endereco/uf/cidade/' +
      'carroInteresse1/carroInteresse2/carroInteresse3/carroAtual1/carroAtual2/carroAtual3/vendedor/status/opcaoVeiculo/observacoes').concat('/')
      .concat(String(nome).concat('/').concat(primeiroContato).concat('/').concat(ultimoContato).concat('/').concat(String(dataNascimento)).concat('/')
      .concat(celular).concat('/').concat(String(telefone)).concat('/').concat(email).concat('/').concat(endereco).concat('/').concat(uf).concat('/').concat(cidade).concat('/')
        .concat(carroInteresse1).concat('/').concat(carroInteresse2).concat('/').concat(carroInteresse3).concat('/')
        .concat(carroAtual1).concat('/').concat(carroAtual2).concat('/').concat(carroAtual3).concat('/')
      .concat(vendedor).concat('/').concat(status).concat('/').concat().concat(opcaoVeiculo).concat('/').concat(observacoes)
    )
    return path.endsWith('-:') ? path.substring(0, path.lastIndexOf(':')) : path
  }

    findLeadsAccordingToFilteredIds(idsCollection: string[]) {
      return this.httpClient.get<Lead[]>(this.leadUrl.concat(`findLeadsAccordingToFilteredIds/${idsCollection}`), this.httpOptions);
    }

}
