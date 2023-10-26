import {Component, Input, OnInit, Pipe, ViewChild} from '@angular/core';
import {Estado} from "../models/estado.model";
import {Municipio} from "../models/municipio.model";
import {Lead} from "../models/lead.model";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {LeadService} from "../services/lead.service";
import {MessageService} from "../services/message.service";
import {Router} from "@angular/router";
import {AlertService} from "../services/alert.service";
import {LocalizacaoService} from "../services/localizacao.service";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {DatePipe, formatDate, Location} from "@angular/common";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})

export class LeadsComponent implements OnInit {

  @Input() isLogged: boolean | undefined;
  @Input() isAdmin: boolean | undefined;
  @Input() username: string | undefined;

  estados: Estado[] = []
  municipios: Municipio [] = []
  leadList: Lead[] = []
  allLeads: Lead[] = []
  id: number | undefined
  nome: string | undefined
  primeiroContato: string | undefined
  ultimoContato: string | undefined
  dataNascimento?: string | undefined

  dataSource = new MatTableDataSource(this.leadList);

  celular: string | undefined
  telefone: string | undefined
  uf: string | undefined
  cidade: string | undefined

  carroInteresse1: string | undefined
  carroInteresse2: string | undefined
  carroInteresse3: string | undefined

  carroAtual1: string | undefined
  carroAtual2: string | undefined
  carroAtual3: string | undefined

  vendedor: string | undefined
  statusSet: (string | undefined)[] = ['Todos', 'Frio','Quente', 'Morno', 'Cliente', 'Comrpou']
  selectedStatus: string | undefined
  opcao: string[] = ['Todos', '0 KM', 'Semi-novo']
  selectedOption: string | undefined
  selectedState: number | undefined
  selectedStateObject: Estado | undefined
  selectedCity: string | undefined
  status: string | undefined

  fetchedLead = new Lead()
  estado: Estado = new Estado()
  municipio: Municipio = new Municipio()

  filteredIds: string | undefined

  displayedColumns  = ['id','nome', 'primeiroContato', 'ultimoContato', 'dataNascimento', 'celular', 'telefone', 'uf', 'cidade',
    'carroInteresse1', 'carroInteresse2', 'carroInteresse3', 'carroAtual1', 'carroAtual2', 'carroAtual3', 'vendedor', 'status', 'opcaoVeiculo']


  constructor(private leadService: LeadService,
              private messageService: MessageService,
              private router: Router,
              private alertService: AlertService,
              private localizacaoService: LocalizacaoService,
              private _liveAnnouncer: LiveAnnouncer,
              private _router: Router,
              private  _location: Location,
  ) {
    this.loadUF()
  }


  ngOnInit(): void {
    debugger;
    this.messageService.getMessage().subscribe( res => {
        this.username = res[`text`];
      },
      err => console.log(err));

    setTimeout( () => {
      if(sessionStorage.getItem('refreshing') !== '1') {
        this.loadLeads()
      }
    }, 500)

    setTimeout( () => {
      this.afterReload();
    }, 700)


  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  // @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(MatPaginatorIntlImpl,undefined);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    //@ts-ignore
    this.dataSource.sort = this.sort
    // @ts-ignore
    this.dataSource.paginator = this.paginator;
  }

  loadLeads = ()=> {
    debugger
    this.leadService.listLeads().subscribe( data => {
      this.leadList = data
      this.allLeads = data
      this.dataSource = new MatTableDataSource(this.leadList);
      this.dataSource.sort = this.sort
      // @ts-ignore
      this.dataSource.paginator = this.paginator;
    }, error => {

    })
  }

  getLead = (id: number) => {
    this.leadService.findLeadByName(this.nome).subscribe(res => {

      const data = res[0]

      this.nome = data.nome
      this.dataNascimento = data.dataNascimento
      this.primeiroContato = data.primeiroContato
      this.ultimoContato = data.ultimoContato

      this.celular = data.celular
      this.telefone = data.telefone
      this.uf = data.uf
      this.cidade = data.cidade
      this.carroInteresse1 =  data.carroInteresse1
      this.carroInteresse2 = data.carroInteresse2
      this.carroInteresse3 = data.carroInteresse3
      this.carroAtual1 = data.carroAtual1
      this.carroAtual2 = data.carroAtual2
      this.carroAtual3 = data.carroAtual3
      this.vendedor = data.vendedor
      this.status = data.status
      this.selectedStatus = data.status
    }, error => {
      console.log(error)
    })
  }

  statusChanged() {

  }

  delete() {
    this.leadService.delete(this.id).subscribe(data => {
      console.log('Lead deletado');
    })
  }

  salvar() {
    debugger
    this.prepareDates()
    const leadToSave = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
      this.estado.nome,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
      this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption)
    console.log('Olá')
    this.leadService.save(leadToSave).subscribe( data => {
      this.leadList.push(data)
    })
  }

  editar = ()=> {
    debugger
    if(this.id !== null && this.id !== undefined) {
      const leadToUpdate = new Lead(this.id,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
        this.estado.nome,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
        this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption)
      this.leadService.update(leadToUpdate).subscribe(data => {
        this.fetchedLead = data
        console.log('Atualizou')
      })
    }

  }

  loadUF() {
    this.localizacaoService.listUFs().subscribe(data => {
      this.estados = data
    })
  }

  stateSelected() {
    debugger
    this.estado = this.estados.filter( item => {return item.id === Number(this.selectedState)})[0]
    this.localizacaoService.listMunicipios(this.selectedState).subscribe(data =>{
      this.municipios = data
    })
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  setIdsToRefresh = () => {
    debugger
    this.filteredIds;
    this.allLeads.filter( elem => {
      if (typeof this.nome === "string") {
        if(elem.nome?.includes(this.nome) && elem.id !== null) {
          this.filteredIds =  this.filteredIds + '' + (elem.id) + ','
        }
        // if (elem.id != null) {
        //   this.filteredIds =  this.filteredIds + '' + (elem.id) + ','
        // }
      }
    })
    if (this.filteredIds != null) {
      this.filteredIds = this.filteredIds.replace('undefined','')
      const ids = this.filteredIds.split(",", this.allLeads.length)
      sessionStorage.setItem('filteredIds',ids.toString())
      this.filteredIds.substring(0, this.filteredIds.lastIndexOf(','))
    }

  }

  search = ()=> {
    debugger
    const leadFilter = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
      this.uf,this.cidade,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,this.carroAtual2,this.carroAtual3,
      this.vendedor,this.status,this.selectedOption)
    this.leadService.findWithFilter(leadFilter).subscribe(res => {
      this.leadList = res
    })
  }

  refresh = () => {
    debugger
    this.keepFields()
    this._router.navigateByUrl('/', {skipLocationChange: true}).then( () => {
      sessionStorage.setItem('refreshing','1')
      sessionStorage.setItem('id', ''+this.id)
      sessionStorage.setItem('nome', ''+this.nome)
      sessionStorage.setItem('primeiroContato', ''+this.primeiroContato)
      sessionStorage.setItem('ultimoContato', ''+this.ultimoContato)
      sessionStorage.setItem('dataNascimento', ''+this.dataNascimento)
      sessionStorage.setItem('celular', ''+this.celular)
      sessionStorage.setItem('telefone', ''+this.telefone)
      sessionStorage.setItem('uf', ''+this.uf)
      sessionStorage.setItem('cidade', ''+this.cidade)
      sessionStorage.setItem('carroInteresse1', ''+this.carroInteresse1)
      sessionStorage.setItem('carroInteresse2', ''+this.carroInteresse2)
      sessionStorage.setItem('carroInteresse3', ''+this.carroInteresse3)
      sessionStorage.setItem('carroAtual1', ''+this.carroAtual1)
      sessionStorage.setItem('carroAtual2', ''+this.carroAtual2)
      sessionStorage.setItem('carroAtual3', ''+this.carroAtual3)
      sessionStorage.setItem('vendedor', ''+this.vendedor)
      sessionStorage.setItem('status', ''+this.selectedStatus)
      sessionStorage.setItem('opcaoVeiculo', ''+this.selectedOption)
      // sessionStorage.setItem('filteredIds',''+this.filteredIds)
      sessionStorage.setItem('nomeLead', this.nome !== undefined ? this.nome.toString() : '')

      this.setIdsToRefresh()

      this._router.navigate([this._location.path()])
    })
  }

  keepFields= () => {
    debugger
    // @ts-ignore
    sessionStorage.setItem('nome', this.nome !== undefined ? this.nome.toString() : '')
    // @ts-ignore
    sessionStorage.setItem('primeiroContato',this.primeiroContato !== undefined ? this.primeiroContato : '')
    // @ts-ignore
    sessionStorage.setItem('ultimoContato',this.ultimoContato !== undefined && this.ultimoContato !== null ? this.ultimoContato : '')
    // @ts-ignore
    sessionStorage.setItem('dataNascimento',this.dataNascimento !== undefined ? this.dataNascimento : '' )
    // @ts-ignore
    sessionStorage.setItem('celular', this.celular !== undefined ? this.celular : '')
    // @ts-ignore
    sessionStorage.setItem('telefone',this.telefone !== undefined ? this.telefone : '')
    // @ts-ignore
    sessionStorage.setItem('uf', this.uf !== undefined ? this.uf : '' )
    // @ts-ignore
    sessionStorage.setItem('cidade', this.cidade !== undefined ? this.cidade : '' )
    // @ts-ignore
    sessionStorage.setItem('carroInteresse1', this.carroInteresse1 !== undefined ? this.carroInteresse1 : '' )

    sessionStorage.setItem('carroInteresse2', this.carroInteresse2 !== undefined ? this.carroInteresse2 : '' )

    sessionStorage.setItem('carroInteresse3', this.carroInteresse3 !== undefined ? this.carroInteresse3 : '' )

    // @ts-ignore
    sessionStorage.setItem('carroAtual1', this.carroAtual1 !== undefined ? this.carroAtual1 : '' )

    sessionStorage.setItem('carroAtual2', this.carroAtual2 !== undefined ? this.carroAtual2 : '' )

    sessionStorage.setItem('carroAtual3', this.carroAtual3 !== undefined ? this.carroAtual3 : '' )
    // @ts-ignore
    sessionStorage.setItem('vendedor', this.vendedor !== undefined ? this.vendedor : '')
    // @ts-ignore
    sessionStorage.setItem('status', this.status !== undefined ? this.status : '')
    // @ts-ignore
    sessionStorage.setItem('opcaoVeiculo', this.opcaoVeiculo !== undefined ? this.opcaoVeiculo : '')

    new Lead(this.id,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
      this.uf,this.selectedCity,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
      this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption)

  }

  private afterReload() {
    debugger
    if(sessionStorage.getItem('refreshing') === '1') {
      sessionStorage.removeItem('refreshing')
      const nameFIeld = sessionStorage.getItem('nome')
      this.nome = nameFIeld !== undefined && nameFIeld !== null ? nameFIeld : ''
      const leadId = Number(sessionStorage.getItem('id'))

      if (leadId !== undefined && leadId !== null) {
        let filteredIds: number[] = []
        const sessionIds = sessionStorage.getItem('filteredIds')
        //@ts-ignore
        const idsArray = sessionIds.split('', this.allLeads.length > 0 ? this.allLeads.length : 100)
        const finalArray: string[] = []

        idsArray.forEach( item => {
          if(item !== ','){
            finalArray.push(item)
          }
        })

        filteredIds = this.prepareIdsArray(finalArray)

        this.allLeads.filter( elem => {
          if (typeof this.nome === "string") {
            elem.nome?.includes(this.nome)
            if (elem.id != null) {
              filteredIds.push(elem.id)
            }
          }
        })
        if(filteredIds.length > 0) {
          this.leadService.findLeadsAfterFilterHasBeenApplied(filteredIds).subscribe(response => {
            this.leadList = response
            this.fetchedLead = response[0]
            this.adjustFieldsIntoDOMElements(this.fetchedLead)
          })
        }
      }
    }
  }

  prepareIdsArray = (filteredIds: string[]) => {
    const ids: number[] = []
    filteredIds.forEach(item => {
      ids.push(Number(item))
    });
    return ids
  }

  private adjustFieldsIntoDOMElements(fetchedLead: Lead) {

    this.id = this.isAcceptableNumberFieldValue('id')
    this.nome = this.isAcceptableFieldValue('nome')
    this.primeiroContato = this.isAcceptableFieldValue('primeiroContato')
    this.ultimoContato = this.isAcceptableFieldValue('ultimoContato')
    this.celular = this.isAcceptableFieldValue('celular')
    this.telefone = this.isAcceptableFieldValue('telefone')
    this.uf = this.isAcceptableFieldValue('uf')
    this.cidade = this.isAcceptableFieldValue('cidade')
    this.carroInteresse1 = this.isAcceptableFieldValue('carroInteresse1')
    this.carroInteresse2 = this.isAcceptableFieldValue('carroInteresse2')
    this.carroInteresse3 = this.isAcceptableFieldValue('carroInteresse3')
    this.carroAtual1 = this.isAcceptableFieldValue('carroAtual1')
    this.carroAtual2 = this.isAcceptableFieldValue('carroAtual2')
    this.carroAtual3 = this.isAcceptableFieldValue('carroAtual3')
    this.vendedor = this.isAcceptableFieldValue('vendedor')
    this.status = this.isAcceptableFieldValue('status')
    this.selectedOption = this.isAcceptableFieldValue('opcaoVeiculo')

    const birthdayDate = this.isAcceptableDateFieldValue('dataNascimento')

    let dataEntrada: any

    if (birthdayDate != null) {
      dataEntrada = new Date(
        Number(birthdayDate.substr(0, 4)), Number(birthdayDate.substring(5, 7)),
        Number(birthdayDate.substring(8, birthdayDate.length)), 0, 0, 0, 0)
    }

    // let date = filter.dataEntradaSearch?.getUTCDate().toString().concat('-').concat(filter.dataEntradaSearch?.getMonth().toString()).concat('-').concat(filter.dataEntradaSearch?.getFullYear().toString())

    debugger

    this.id = fetchedLead !== undefined && fetchedLead.id !== undefined ? fetchedLead.id : 0
    this.nome = fetchedLead !== undefined && fetchedLead.nome !== undefined ? fetchedLead.nome : ''
    this.primeiroContato = fetchedLead !== undefined && fetchedLead.primeiroContato !== undefined ? fetchedLead.primeiroContato : ''
    this.ultimoContato = fetchedLead !== undefined && fetchedLead.ultimoContato !== undefined ? fetchedLead.ultimoContato : ''
    this.dataNascimento = fetchedLead !== undefined && fetchedLead.dataNascimento !== undefined ? fetchedLead.dataNascimento : ''
    this.celular = fetchedLead !== undefined && fetchedLead.celular !== undefined ? fetchedLead.celular : ''
    this.telefone = fetchedLead !== undefined && fetchedLead.telefone !== undefined ? fetchedLead.telefone : ''
    this.uf = fetchedLead !== undefined && fetchedLead.uf !== undefined ? fetchedLead.uf : ''
    this.cidade = fetchedLead !== undefined && fetchedLead.cidade !== undefined ? fetchedLead.cidade : ''
    this.carroInteresse1 = fetchedLead !== undefined && fetchedLead.carroInteresse1 !== undefined ? fetchedLead.carroInteresse1 : ''
    this.carroInteresse2 = fetchedLead !== undefined && fetchedLead.carroInteresse2 !== undefined ? fetchedLead.carroInteresse2 : ''
    this.carroInteresse3 = fetchedLead !== undefined && fetchedLead.carroInteresse3 !== undefined ? fetchedLead.carroInteresse3 : ''
    this.carroAtual1 = fetchedLead !== undefined && fetchedLead.carroAtual1 !== undefined ? fetchedLead.carroAtual1 : ''
    this.carroAtual1 = fetchedLead !== undefined && fetchedLead.carroAtual2 !== undefined ? fetchedLead.carroAtual2 : ''
    this.carroAtual1 = fetchedLead !== undefined && fetchedLead.carroAtual3 !== undefined ? fetchedLead.carroAtual3 : ''
    this.vendedor = fetchedLead !== undefined && fetchedLead.vendedor !== undefined ? fetchedLead.vendedor : ''
    this.selectedOption = fetchedLead !== undefined && fetchedLead.opcaoVeiculo !== undefined ? fetchedLead.opcaoVeiculo : ''

    if(fetchedLead !== undefined && fetchedLead.uf !== null && fetchedLead.uf !== undefined && fetchedLead.uf.length > 1) {
      this.estados = []
      const estado = this.estados.filter( e => e.id === fetchedLead.uf)[0]
      if(estado !== null && estado !== undefined) {
        this.estados.push(estado)
      }
    }

    const leadItem = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
      this.uf,this.selectedCity,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
      this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption)

    //TODO-LEANDRO tratar a data
    if(sessionStorage.getItem('filteredIds') === undefined || sessionStorage.getItem('filteredIds') === null) {
      this.leadList = [];
      this.leadList = [leadItem]
      this.clearSessionValues()
    }


    this.dataSource = new MatTableDataSource(this.leadList);
    this.dataSource.sort = this.sort

  }

  isAcceptableNumberFieldValue(field: string) {
    return sessionStorage.getItem(field) !== null &&
    sessionStorage.getItem(field) !== undefined
      ? Number(sessionStorage.getItem(field)) : undefined
  }

  isAcceptableFieldValue(field: string) {
    return sessionStorage.getItem(field) !== null &&
    sessionStorage.getItem(field) !== undefined ?
      String(sessionStorage.getItem(field)) : undefined
  }

  isAcceptableDateFieldValue(field: string) {
    return sessionStorage.getItem(field) !== null &&
    sessionStorage.getItem(field) !== undefined ?
      String(sessionStorage.getItem(field)) : undefined
  }

  clearSessionValues() {
    sessionStorage.removeItem('nome')
    sessionStorage.removeItem('primeiroContato')
    sessionStorage.removeItem('ultimoContato')
    sessionStorage.removeItem('dataNascimento')
    sessionStorage.removeItem('celular')
    sessionStorage.removeItem('telefone')
    sessionStorage.removeItem('uf')
    sessionStorage.removeItem('cidade')
    sessionStorage.removeItem('carroInteresse1')
    sessionStorage.removeItem('carroInteresse2')
    sessionStorage.removeItem('carroInteresse3')
    sessionStorage.removeItem('carroAtual1')
    sessionStorage.removeItem('carroAtual2')
    sessionStorage.removeItem('carroAtual3')
    sessionStorage.removeItem('vendedor')
    sessionStorage.removeItem('status')
    sessionStorage.removeItem('opcaoVeiculo')
    sessionStorage.removeItem('filteredIds')
  }

  cityChanged() {
    debugger
    const cidade = this.municipios.filter( item => {
      return item.id === Number(this.selectedCity)
    })[0]
    this.municipio = cidade
  }

  protected readonly formatDate = formatDate;

  prepareBirthDateToBeShowed(date: string | undefined) {
    debugger
    //const datePipe = new DatePipe('pt-BR')
    const fdate = String(date)
    const year = fdate.substr(0,4)
    const month = fdate.substr(5,2)
    const day = fdate.substr(8,fdate.length-1)
    const dtNascFormatted = day.concat('-').concat(month).concat('-').concat(year)

    const finalDate = new Date(dtNascFormatted);
    this.dataNascimento = dtNascFormatted
  }

  prepareFirstContactToBeShowed(date: string | undefined) {
    debugger
    const fdate = String(date)
    const year = fdate.substr(0,4)
    const month = fdate.substr(5,2)
    const day = fdate.substr(8,fdate.length-1)
    const dtNascFormatted = day.concat('-').concat(month).concat('-').concat(year)

    //const dtNasc =  String(date)
    // const dtNascFormatted = dtNasc.substr(0,3).concat('-').concat(dtNasc.substr(5,2))
    //   .concat('-').concat(dtNasc.substr(7,dtNasc.length -1))

    this.primeiroContato = dtNascFormatted
  }

  prepareLastContactToBeShowed(date: string | undefined) {
    debugger
    const fdate = String(date)
    const year = fdate.substr(0,4)
    const month = fdate.substr(5,2)
    const day = fdate.substr(8,fdate.length-1)
    const dtNascFormatted = day.concat('-').concat(month).concat('-').concat(year)

    this.ultimoContato = dtNascFormatted
  }

  private prepareDates() {
    debugger
    if(this.dataNascimento !== null && this.dataNascimento !== undefined && this.dataNascimento.length > 1)
      this.prepareBirthDateToBeShowed(this.dataNascimento);
    if(this.primeiroContato !== null && this.primeiroContato !== undefined && this.primeiroContato.length > 1)
      this.prepareFirstContactToBeShowed(this.primeiroContato);
    if(this.ultimoContato !== null && this.ultimoContato !== undefined && this.ultimoContato.length > 1)
      this.prepareLastContactToBeShowed(this.ultimoContato);
  }

  adicionar() {

  }
}

