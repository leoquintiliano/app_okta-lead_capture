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
  allLeadsTemp : Lead[] = []
  id: number | undefined
  nome: string | undefined
  primeiroContato: string | undefined
  ultimoContato: string | undefined
  dataNascimento?: string | undefined
  observacoes: string | undefined

  dataSource = new MatTableDataSource(this.leadList);

  celular: string | undefined
  telefone: string | undefined
  email: string | undefined
  endereco: string | undefined

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
  opcao: string[] = ['Todos', '0 KM', 'Semi-novo']
  selectedStatus: string | undefined
  selectedOption: string | undefined
  selectedState: number | undefined
  selectedStateObject: Estado | undefined
  selectedCity: string | undefined
  status: string | undefined

  fetchedLead = new Lead()
  estado: Estado = new Estado()
  municipio: Municipio = new Municipio()

  diasCadastro: number | undefined
  diasUltimoContato: number | undefined

  filteredIds: string | undefined

  displayedColumns  = ['id','nome', 'primeiroContato', 'diasCadastro', 'ultimoContato', 'diasUltimoContato', 'dataNascimento', 'celular', 'telefone','uf', 'cidade', 'email',
      'endereco', 'carroInteresse1', 'carroInteresse2', 'carroInteresse3', 'carroAtual1', 'carroAtual2', 'carroAtual3', 'vendedor', 'status', 'opcaoVeiculo', 'observacoes']


  submitted: boolean
  private allCities: Municipio[];

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

      setTimeout(()=> {
        // @ts-ignore
        this.dataSource.paginator = this.paginator;
      },500)

    }, error => {
      console.log('Erro ao tentar localizar os laeads!')
    })
  }

  getLead = () => {
    this.leadService.findLeadByName(this.nome).subscribe(res => {

      const data = res[0]

      this.nome = data.nome
      this.dataNascimento = data.dataNascimento
      this.primeiroContato = data.primeiroContato
      this.ultimoContato = data.ultimoContato

      this.celular = data.celular
      this.telefone = data.telefone
      this.email = data.email
      this.endereco = data.endereco

      this.uf = data.uf
      this.cidade = data.cidade

      this.localizacaoService.listUFs().subscribe( response => {
        this.estados = response
      })

      this.estado = this.estados.filter( item => {return item.nome === this.uf})[0]
      this.municipio = this.municipios.filter(m => m.nome == data.cidade)[0]

      // if(this.estado && this.estado.id) {
      //   this.localizacaoService.listMunicipios(this.estado.id).subscribe( res => {
      //     this.municipios = res
      //   })
      // }

      setTimeout( ()=> {
        this.carroInteresse1 =  data.carroInteresse1
        this.carroInteresse2 = data.carroInteresse2
        this.carroInteresse3 = data.carroInteresse3
        this.carroAtual1 = data.carroAtual1
        this.carroAtual2 = data.carroAtual2
        this.carroAtual3 = data.carroAtual3
        this.vendedor = data.vendedor
        this.status = data.status
        this.selectedStatus = data.status
        this.observacoes = data.observacoes
        this.diasUltimoContato = data.diasUltimoContato
        this.diasUltimoContato = data.diasUltimoContato
        const featchedLead = [data]

        this.dataSource = new MatTableDataSource(featchedLead);
      },900)

      // this.dataSource.sort = this.sort

    }, error => {
      console.log(error)
    })
  }

  statusChanged() {
    debugger
    console.log(this.selectedStatus)
  }

  optionChanged() {
    debugger
    console.log(this.selectedOption)
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
        this.endereco,this.email,this.estado.nome,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
      this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes)
    console.log('Olá')
    this.leadService.save(leadToSave).subscribe( data => {
      this.leadList.push(data)
    })
  }

  editar = ()=> {
    debugger
    if(this.id !== null && this.id !== undefined) {
      //TODO-LEANDRO validate and treat the city and state fields to edit and show in the component
      if( (this.nome !== undefined && this.nome !== '' && this.nome !== ' ') && (this.carroInteresse1 !== undefined && this.carroInteresse1 !== '' && this.carroInteresse1 !== ' ') &&
          (this.carroAtual1 !== undefined && this.carroAtual1 !== '' && this.carroAtual1 !== ' ') &&  (this.observacoes && this.observacoes !== '') &&
          (this.selectedOption !== undefined && this.selectedOption !== '') && (this.dataNascimento !== undefined && this.dataNascimento !== '' && this.dataNascimento !== ' ') &&
          (this.selectedCity && this.selectedCity !== '') && (this.selectedState && this.selectedState > 0) &&
          (this.selectedStatus !== undefined && this.selectedStatus !== '') &&
          (this.celular !== undefined && this.celular !== '')
       ) {
        const leadToUpdate = new Lead(this.id,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
            this.endereco,this.email,this.estado.nome,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,
            this.carroAtual1,this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes)
        this.leadService.update(leadToUpdate).subscribe(data => {
          this.fetchedLead = data
          this.refresh()
          console.log('Atualizou')
        })
      } else {
        this.alertService.info('Reveja os campos obrigatórios antes de prosseguir','Atenção!')
      }


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
    this.uf = this.estados.filter( item => {return item.id === Number(this.selectedState)})[0].nome
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
          // this.filteredIds =  (this.filteredIds == "undefined" || this.filteredIds == undefined) ? '' : this.filteredIds + '' + (elem.id) + ','
          this.filteredIds =  this.filteredIds + '' + (elem.id) + ','.replace('undefined','')
          this.filteredIds = this.filteredIds.replace('undefined','')
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
    const name = this.nome
    if(name && sessionStorage.getItem('isRefreshing') === '1') {
      this.resetToFilter()
    }

    // let idsAfterSearch : number[] = []

    this.nome = name
    this.nome = this.nome === '' ? ' ' : this.nome
    const leadFilter = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
      this.endereco,this.email,this.uf,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,this.carroAtual2,this.carroAtual3,
      this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes)

    // setTimeout( ()=>{
    //
    // },600)

    this.leadService.findWithFilter(leadFilter).subscribe(res => {
      this.leadList = res
      this.dataSource = new MatTableDataSource(this.leadList);
      this.dataSource.sort = this.sort
    })

    // this.leadList.forEach( item => {
    //   idsAfterSearch.push(item.id as number)
    // })
    //
    // this.leadService.findLeadsAfterFilterHasBeenApplied(idsAfterSearch).subscribe( accumulator => {
    //   this.leadList = accumulator
    // })

    setTimeout( () => {
      if(this.nome === undefined || this.nome === 'undefined') {
        this.nome = ''
      }
    }, 900)

  }

  doRefresh=()=>{
    sessionStorage.setItem('isRefreshing','1')
    this.refresh()
  }

  buscar = ()=>{
    //this.leadService.findLeadByName()
}

  refresh = () => {
    debugger
    this.keepFields()
    this._router.navigateByUrl('/', {skipLocationChange: true}).then( () => {

      sessionStorage.setItem('id', ''+this.id)
      sessionStorage.setItem('nome', ''+this.nome)
      sessionStorage.setItem('primeiroContato', ''+this.primeiroContato)
      sessionStorage.setItem('ultimoContato', ''+this.ultimoContato)
      sessionStorage.setItem('dataNascimento', ''+this.dataNascimento)
      sessionStorage.setItem('celular', ''+this.celular)
      sessionStorage.setItem('telefone', ''+this.telefone)
      sessionStorage.setItem('email', ''+this.email)
      sessionStorage.setItem('endereco', ''+this.endereco)
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
      sessionStorage.setItem('observacoes', ''+this.observacoes)
      // sessionStorage.setItem('filteredIds',''+this.filteredIds)
      sessionStorage.setItem('nomeLead', this.nome !== undefined ? this.nome.toString() : '')

      this.setIdsToRefresh()
      if(sessionStorage.getItem('isRefreshing') === '1') {
        sessionStorage.setItem('refreshing','0')
        this._router.navigate([this._location.path()])
      }

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
    sessionStorage.setItem('email',this.email !== undefined ? this.email : '')
    // @ts-ignore
    sessionStorage.setItem('endereco',this.endereco !== undefined ? this.endereco : '')

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
    // @ts-ignore
    sessionStorage.setItem('observacoes', this.observacoes !== undefined ? this.observacoes : '')

    new Lead(this.id,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
        this.endereco,this.email,this.uf,this.selectedCity,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,
      this.carroAtual1,this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes)

  }

  private afterReload() {
    debugger
    if(sessionStorage.getItem('refreshing') === '1') {
      sessionStorage.removeItem('refreshing')
      this.allLeadsTemp = this.allLeads
      this.loadLeads()
      this.allLeads = this.allLeadsTemp

      this.prepareLeadsArrayAfterFilter()

      const nameFIeld = sessionStorage.getItem('nome')
      this.nome = nameFIeld !== undefined && nameFIeld !== null ? nameFIeld : ''
      const leadId = Number(sessionStorage.getItem('id'))

      if (leadId !== undefined && leadId !== null) {
        let filteredIds: number[] = []
        let sessionIds = sessionStorage.getItem('filteredIds')
        // @ts-ignore

        sessionIds = sessionIds.endsWith(',') ? sessionIds.substring(0,sessionIds.length-1) : sessionIds
        //@ts-ignore
        const idsArray = sessionIds.split(',', this.allLeads.length > 0 ? this.allLeads.length : 100)
        const finalArray: string[] = []

        idsArray.forEach( item => {
          if(item !== ',') {
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
        if(filteredIds.length > 0 && filteredIds[0] !== -1) {
          this.leadService.findLeadsAfterFilterHasBeenApplied(filteredIds).subscribe(response => {
            this.leadList = response
            this.fetchedLead = response[0]
            this.adjustFieldsIntoDOMElements(this.fetchedLead)
          })
        }
      }
    }
    sessionStorage.setItem('filteredIds','-1')

    setTimeout( () => {
      if(this.nome === undefined || this.nome === 'undefined') {
        this.nome = ''
      }
    }, 500)

  }

  prepareIdsArray = (filteredIds: string[]) => {
    const ids: number[] = []
    filteredIds.forEach(item => {
      ids.push(Number(item))
    });
    return ids
  }

  prepareLeadsArrayAfterFilter =() => {
    if(sessionStorage.getItem('hasSearched') === '1' && sessionStorage.getItem('ffilteredIds') &&
        sessionStorage.getItem('filteredIds') !== '0' && sessionStorage.getItem('filteredIds') !== '-1' ) {
      const idsCollection = this.prepareIdsCollection();
      let filteredIds: number[] = []
      idsCollection.forEach( item => {
        filteredIds.push( Number(item))
      })
      this.leadService.findLeadsAfterFilterHasBeenApplied(filteredIds).subscribe(response => {
        this.leadList = response
        this.fetchedLead = response[0]
        this.adjustFieldsIntoDOMElements(this.fetchedLead)
      })
    }
  }

  public prepareIdsCollection() {
    let filteredIds: number[] = []
    let sessionIds = sessionStorage.getItem('filteredIds')
    // @ts-ignore
    sessionIds = sessionIds.endsWith(',') ? sessionIds.substring(0,sessionIds.length-1) : sessionIds
    //@ts-ignore
    const idsArray = sessionIds.split(',', this.allLeads.length > 0 ? this.allLeads.length : 100)
    const finalArray: string[] = []
    idsArray.forEach( item => {
      if(item !== ',') {
        finalArray.push(item)
      }
    })
    return finalArray
  }

  private adjustFieldsIntoDOMElements(fetchedLead: Lead) {

    this.id = this.isAcceptableNumberFieldValue('id')
    this.nome = this.isAcceptableFieldValue('nome')
    this.primeiroContato = this.isAcceptableFieldValue('primeiroContato')
    this.ultimoContato = this.isAcceptableFieldValue('ultimoContato')
    this.celular = this.isAcceptableFieldValue('celular')
    this.telefone = this.isAcceptableFieldValue('telefone')
    this.email = this.isAcceptableFieldValue('email')
    this.endereco = this.isAcceptableFieldValue('endereco')
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
    this.observacoes = this.isAcceptableFieldValue('observacoes')

    const birthdayDate = this.isAcceptableDateFieldValue('dataNascimento')

    let dataEntrada: unknown

    if (birthdayDate != null) {
      dataEntrada = new Date(
        Number(birthdayDate.substr(0, 4)), Number(birthdayDate.substring(5, 7)),
        Number(birthdayDate.substring(8, birthdayDate.length)), 0, 0, 0, 0)
    }

    // let date = filter.dataEntradaSearch?.getUTCDate().toString().concat('-').concat(filter.dataEntradaSearch?.getMonth().toString()).concat('-').concat(filter.dataEntradaSearch?.getFullYear().toString())

    debugger
    if(fetchedLead) {
      this.id = fetchedLead !== undefined && fetchedLead.id !== undefined ? fetchedLead.id : 0
      this.nome = fetchedLead !== undefined && fetchedLead.nome !== undefined ? fetchedLead.nome : ''
      this.primeiroContato = fetchedLead !== undefined && fetchedLead.primeiroContato !== undefined ? fetchedLead.primeiroContato : ''
      this.ultimoContato = fetchedLead !== undefined && fetchedLead.ultimoContato !== undefined ? fetchedLead.ultimoContato : ''
      this.dataNascimento = fetchedLead !== undefined && fetchedLead.dataNascimento !== undefined ? fetchedLead.dataNascimento : ''
      this.celular = fetchedLead !== undefined && fetchedLead.celular !== undefined ? fetchedLead.celular : ''
      this.telefone = fetchedLead !== undefined && fetchedLead.telefone !== undefined ? fetchedLead.telefone : ''
      this.email = fetchedLead.email !== undefined ? fetchedLead.email : ''
      this.endereco = fetchedLead.endereco !== undefined ? fetchedLead.endereco : ''
      this.uf = fetchedLead.uf !== undefined ? fetchedLead.uf : ''
      this.cidade = fetchedLead.cidade !== undefined ? fetchedLead.cidade : ''
      this.carroInteresse1 = fetchedLead.carroInteresse1 !== undefined ? fetchedLead.carroInteresse1 : ''
      this.carroInteresse2 = fetchedLead.carroInteresse2 !== undefined ? fetchedLead.carroInteresse2 : ''
      this.carroInteresse3 = fetchedLead.carroInteresse3 !== undefined ? fetchedLead.carroInteresse3 : ''
      this.carroAtual1 = fetchedLead.carroAtual1 !== undefined ? fetchedLead.carroAtual1 : ''
      this.carroAtual2 = fetchedLead.carroAtual2 !== undefined ? fetchedLead.carroAtual2 : ''
      this.carroAtual3 = fetchedLead.carroAtual3 !== undefined ? fetchedLead.carroAtual3 : ''
      this.vendedor = fetchedLead.vendedor !== undefined ? fetchedLead.vendedor : ''
      this.selectedStatus = fetchedLead && fetchedLead.status ? fetchedLead.status : ''
      this.selectedOption = fetchedLead.opcaoVeiculo !== undefined ? fetchedLead.opcaoVeiculo : ''
      this.observacoes = fetchedLead.observacoes !== undefined ? fetchedLead.observacoes: ''
      this.diasCadastro = fetchedLead.diasCadastro !== undefined ? fetchedLead.diasCadastro : 0
      this.diasUltimoContato = fetchedLead.diasUltimoContato !== undefined ? fetchedLead.diasUltimoContato : 0
    }


    if(fetchedLead !== undefined && fetchedLead.uf !== null && fetchedLead.uf !== undefined && fetchedLead.uf.length > 1) {
      const estado = this.estados.filter( e => e.sigla === fetchedLead.uf || e.nome === fetchedLead.uf )[0]
      this.estado = estado
      this.selectedState = estado.id
      this.estados = []
      if(estado) {
        this.estados.push(estado)
      }
      this.localizacaoService.listMunicipios(this.estado.id).subscribe(data => {
        this.municipios = data
      })

      setTimeout( () => {
        if(this.municipios) {
          this.municipio = this.municipios.filter( m => m.nome === this.cidade)[0]
          this.allCities = this.municipios
          this.municipios = [this.municipio]
          this.selectedCity = this.municipio.nome
          this.municipios = this.allCities
        }
      }, 500)


    }

    const leadItem = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.telefone,
        this.endereco,this.email,this.uf,this.selectedCity,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
      this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes,this.diasCadastro,this.diasUltimoContato)

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
    sessionStorage.removeItem('email')
    sessionStorage.removeItem('endereco')
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
    sessionStorage.removeItem('observacoes')
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
    this._router.navigate(['/lead'])
  }

  submit() {
    debugger
    console.log('Form has been submitted')
    this.submitted = true
  }

  public clear() {
    this.id = undefined
    this.nome = ''
    this.primeiroContato = ''
    this.ultimoContato = ''
    this.celular = ''
    this.telefone = ''
    this.email = ''
    this.endereco = ''
    this.uf = ''
    this.cidade = ''
    this.carroInteresse1 = ''
    this.carroInteresse2 = ''
    this.carroInteresse3 = ''
    this.carroAtual1 = ''
    this.carroAtual2 = ''
    this.carroAtual3 = ''
    this.vendedor = ''
    this.status = ''
    this.selectedOption = ''
    this.selectedStatus = ''
    this.observacoes = ''
  }

  public resetToFilter() {
    this.id = undefined
    this.primeiroContato = '-'
    this.ultimoContato = '-'
    this.celular = '-'
    this.telefone = '-'
    this.email = '-'
    this.endereco = '-'
    this.uf = '-'
    this.cidade = '-'
    this.carroInteresse1 = '-'
    this.carroInteresse2 = '-'
    this.carroInteresse3 = '-'
    this.carroAtual1 = '-'
    this.carroAtual2 = '-'
    this.carroAtual3 = '-'
    this.vendedor = '-'
    this.status = ''
    this.selectedStatus = '-'
    this.selectedOption = '-'
    this.observacoes = '-'
  }

}

