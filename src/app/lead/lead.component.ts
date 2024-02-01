import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {LeadService} from "../services/lead.service";
import {Lead} from "../models/lead.model";
import {Router} from "@angular/router";
import {MessageService} from "../services/message.service";
import {AlertService} from "../services/alert.service";
import {Estado} from "../models/estado.model";
import {Municipio} from "../models/municipio.model";
import {LocalizacaoService} from "../services/localizacao.service";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Location} from "@angular/common";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.css']
})
export class LeadComponent implements OnInit {

  @Input() isLogged: boolean | undefined;
  @Input() isAdmin: boolean | undefined;
  @Input() username: string | undefined;

  estados: Estado[] = []
  municipios: Municipio [] = []
  leadList: Lead[] = []
  id: number | undefined
  nome: string | undefined
  primeiroContato: string | undefined
  ultimoContato: string | undefined
  dataNascimento?: string | undefined
  observacoes: string | undefined

  dataSource = new MatTableDataSource(this.leadList);

  celular: string | undefined
  celular2: string | undefined
  telefone: string | undefined
  uf: string | undefined
  cidade: string | undefined
  email: string | undefined
  endereco: string | undefined

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

  diasCadastro: number | undefined
  diasUltimoContato: number | undefined
  dataVenda?: string | undefined

  displayedColumns  = ['id','nome', 'primeiroContato', 'ultimoContato', 'dataNascimento', 'celular', 'celular2', 'telefone', 'uf', 'cidade',
    'carroInteresse1', 'carroInteresse2', 'carroInteresse3', 'carroAtual1', 'carroAtual2', 'carroAtual3', 'vendedor', 'status', 'opcaoVeiculo']

  // cadLeadForm!: FormGroup

  submitted: boolean
  hasClickedOnClean: boolean
  haspersisted: boolean

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
      this.adjustExtendedMethodMenuBarCss()
    }, 700)

    // this.prepareFormToValidate()

    // this.cadLeadForm = new FormGroup({
    //   title: new FormControl('',Validators.required)
    // })

    this.submitted = false

  }

  @ViewChild(MatSort) sort: MatSort = new MatSort();

  ngAfterViewInit() {
    //@ts-ignore
    this.dataSource.sort = this.sort
  }

  loadLeads = ()=> {
    debugger
    this.leadService.listLeads().subscribe( data => {
      this.leadList = data
      this.dataSource = new MatTableDataSource(this.leadList);
      this.dataSource.sort = this.sort
    }, error => {

    })
  }

  salvar() {
    debugger
    this.formatTextWithNoSymbols()
    if(this.observacoes && this.observacoes?.length >= 254) {
      this.alertService.error('O campo observações excedeu o tamanho limite permitido de 254 caracteres! ','Atenção!')
      return
    }
    if(!this.validatePhone()) {
      this.alertService.info('Reveja os campos de contato antes de prosseguir','Atenção!')
      return
    }
    if( (this.nome !== undefined && this.nome !== '' && this.nome !== ' ') && (this.carroInteresse1 !== undefined && this.carroInteresse1 !== '' && this.carroInteresse1 !== ' ') &&
        (this.carroAtual1 !== undefined && this.carroAtual1 !== '' && this.carroAtual1 !== ' ') && /* (this.observacoes && this.observacoes !== '') && */
        (this.selectedOption !== undefined && this.selectedOption !== '') && (this.dataNascimento !== undefined && this.dataNascimento !== '' && this.dataNascimento !== ' '
        && (this.selectedState !== undefined) &&
        (this.selectedStatus !== undefined && this.selectedStatus !== '') && (this.celular !== undefined && this.celular !== '')
    ) ) {
      this.prepareDates()
      const leadToSave = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.celular2,this.telefone,
          this.endereco,this.email,this.estado.nome,this.municipio.nome,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,this.carroAtual1,
          this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes,this.diasCadastro,this.diasUltimoContato,this.dataVenda)
      console.log('Olá')
      this.leadService.save(leadToSave).subscribe( data => {
        this.leadList.push(data)
        this.haspersisted = true
      })
      setTimeout( ()=> {
        this.submitted = false
        if(this.haspersisted) {
          this.alertService.info('Dados cadastrados com sucesso','Informação!')
          this._router.navigate(['/leads'])
        }
      },900)

    } else {
      this.alertService.error('Reveja os campos obrigatórios antes de prosseguir','Atenção!')
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

  private afterReload() {
    debugger
    if(sessionStorage.getItem('refreshing') === '1') {
      sessionStorage.removeItem('refreshing')
      const nameField = sessionStorage.getItem('nome')
      this.nome = nameField !== undefined && nameField !== null ? nameField : ''
      const leadId = Number(sessionStorage.getItem('id'))
      if (leadId !== undefined && leadId !== null) {
        this.leadService.findLeadByName(this.nome).subscribe(response => {
          this.fetchedLead = response[0]
          this.adjustFieldsIntoDOMElements(this.fetchedLead)
        })
      }
    }
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

  private adjustFieldsIntoDOMElements(fetchedLead: Lead) {

    this.id = this.isAcceptableNumberFieldValue('id')
    this.nome = this.isAcceptableFieldValue('nome')
    this.primeiroContato = this.isAcceptableFieldValue('primeiroContato')
    this.ultimoContato = this.isAcceptableFieldValue('ultimoContato')
    this.celular = this.isAcceptableFieldValue('celular')
    this.celular2 = this.isAcceptableFieldValue('celular2')
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

    //this.dataNascimento = this.isAcceptableDateFieldValue('dataNascimento')

    const birthdayDate = this.isAcceptableDateFieldValue('dataNascimento')

    let dataEntrada: any

    if (birthdayDate != null) {
      dataEntrada = new Date(
        Number(birthdayDate.substr(0, 4)), Number(birthdayDate.substring(5, 7)),
        Number(birthdayDate.substring(8, birthdayDate.length)), 0, 0, 0, 0)
    }

    // let dataEntrada = new Date(
    //   Number(this.dataNascimento?.substr(0,4)),Number(this.dataEntrada?.substring(5,7)),
    //   Number(this.dataEntrada?.substring(8,this.dataEntrada?.length)),0,0,0,0)

    // let date = filter.dataEntradaSearch?.getUTCDate().toString().concat('-')
    //      .concat(filter.dataEntradaSearch?.getMonth().toString()).concat('-').concat(filter.dataEntradaSearch?.getFullYear().toString())

    debugger

    this.nome = fetchedLead.nome !== undefined ? fetchedLead.nome : ''
    this.primeiroContato = fetchedLead.primeiroContato !== undefined ? fetchedLead.primeiroContato : ''
    this.ultimoContato = fetchedLead.ultimoContato !== undefined ? fetchedLead.ultimoContato : ''
    this.dataNascimento = fetchedLead.dataNascimento !== undefined ? fetchedLead.dataNascimento : ''
    this.celular = fetchedLead.celular !== undefined ? fetchedLead.celular : ''
    this.celular2 = fetchedLead.celular2 !== undefined ? fetchedLead.celular2 : ''
    this.telefone = fetchedLead.telefone !== undefined ? fetchedLead.telefone : ''
    this.email = fetchedLead.email !== undefined ? fetchedLead.email : ''
    this.endereco = fetchedLead.endereco !== undefined ? fetchedLead.endereco : ''
    this.uf = fetchedLead.uf !== undefined ? fetchedLead.uf : ''
    this.cidade = fetchedLead.cidade !== undefined ? fetchedLead.cidade : ''
    this.carroInteresse1 = fetchedLead.carroInteresse1 !== undefined ? fetchedLead.carroInteresse1 : ''
    this.carroInteresse2 = fetchedLead.carroInteresse2 !== undefined ? fetchedLead.carroInteresse2 : ''
    this.carroInteresse3 = fetchedLead.carroInteresse3 !== undefined ? fetchedLead.carroInteresse3 : ''
    this.carroAtual1 = fetchedLead.carroAtual1 !== undefined ? fetchedLead.carroAtual1 : ''
    this.carroAtual1 = fetchedLead.carroAtual2 !== undefined ? fetchedLead.carroAtual2 : ''
    this.carroAtual1 = fetchedLead.carroAtual3 !== undefined ? fetchedLead.carroAtual3 : ''
    this.vendedor = fetchedLead.vendedor !== undefined ? fetchedLead.vendedor : ''
    this.selectedOption = fetchedLead.opcaoVeiculo !== undefined ? fetchedLead.opcaoVeiculo : ''
    this.observacoes = fetchedLead.observacoes !== undefined ? fetchedLead.observacoes: ''

    if(fetchedLead.uf !== undefined && fetchedLead.uf.length > 1) {
      this.estados = []
      const estado = this.estados.filter( e => e.id === fetchedLead.uf)[0]
      this.estados.push(estado)
    }

    // if(fetchedLead.cidade !== undefined && fetchedLead.cidade.length > 1) {
    //   this.municipios = []
    //   const municipio = this.municipios.filter( m => m.id === fetchedLead.cidade)[0]
    //   this.municipios.push(municipio)
    // }

    const leadItem = new Lead(0,this.nome,this.primeiroContato,this.ultimoContato,this.dataNascimento,this.celular,this.celular2,this.telefone,
        this.endereco,this.email,this.uf,this.selectedCity,this.carroInteresse1,this.carroInteresse2,this.carroInteresse3,
      this.carroAtual1,this.carroAtual2,this.carroAtual3,this.vendedor,this.selectedStatus,this.selectedOption,this.observacoes)

    //TODO-LEANDRO tratar a data

    this.leadList = [];
    this.leadList = [leadItem]
    this.clearSessionValues()

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
    sessionStorage.removeItem('celular2')
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
    sessionStorage.removeItem('observacoes')
  }

  cityChanged() {
    debugger
    const cidade = this.municipios.filter( item => {
      return item.id === Number(this.selectedCity)
    })[0]
    this.municipio = cidade
  }

  // private prepareFormToValidate() {
  //   // this.cadLeadForm = new FormGroup({
  //   //   txNome: new FormControl('',Validators.required),
  //   //   txFirstContact: new FormControl(''),
  //   //   title: new FormControl('',Validators.required)
  //   // })
  //
  //   this.cadLeadForm = new FormGroup({
  //     title: new FormControl('',Validators.required)
  //   })
  //
  // }
  //
  // get title() {
  //   //return this.cadLeadForm.get('title')! !== undefined && this.cadLeadForm.get('title') !== null ? this.cadLeadForm.get('title') : ''
  //   return this.cadLeadForm.get('title')!
  // }
  //
  // get description() {
  //   return this.cadLeadForm.get('description')
  // }

  // get nome() {
  //   return this.cadLeadForm.get('nome')
  // }

  submit() {
    debugger
    console.log('Form has been submitted')
    this.submitted = true
  }

  validate() {
    if(this.nome !== undefined && this.nome !== '') {
      this.submitted = false
    }
  }

  private validatePhone() {
    const maySavePhone = this.celular?.length === 11 ? true : false
    const maySaveMobile = this.telefone?.length === 10 ? true : false
    return maySavePhone && maySaveMobile
  }

  public clear() {
    debugger
    this.id = undefined
    this.nome = ''
    this.primeiroContato = ''
    this.ultimoContato = ''
    this.celular = ''
    this.celular2 = ''
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
    this.dataNascimento = ''
    this.hasClickedOnClean = true
  }

  private adjustExtendedMethodMenuBarCss() {
    // @ts-ignore
    document.getElementById('general_menu_bar').className='navbar navbar-expand-xl navbar-dark bg-dark menu-bar-mid-full-adaptive'
  }

  statusChanged() {
    debugger
    console.log(this.selectedStatus)
  }

  optionChanged() {
    debugger
    console.log(this.selectedOption)
  }

  formatTextWithNoSymbols = () => {
    this.removeSymbolsFromCar()
    this.removeSymbolsFromLeadBasicInfo()
  }

  removeSymbolsFromCar = () =>  {
    if(this.carroAtual1)
      this.carroAtual1 = this.removeSymbolsFromText(this.carroAtual1)
    if(this.carroAtual2)
      this.carroAtual2 = this.removeSymbolsFromText(this.carroAtual2)
    if(this.carroAtual3)
      this.carroAtual3 = this.removeSymbolsFromText(this.carroAtual3)
    if(this.carroInteresse1)
      this.carroInteresse1 = this.removeSymbolsFromText(this.carroInteresse1)
    if(this.carroInteresse2)
      this.carroInteresse2 = this.removeSymbolsFromText(this.carroInteresse2)
    if(this.carroInteresse3)
      this.carroInteresse3 = this.removeSymbolsFromText(this.carroInteresse3)
  }

  removeSymbolsFromLeadBasicInfo = () => {
    if(this.nome)
      this.nome = this.removeSymbolsFromText(this.nome)
    if(this.email)
      this.email = this.removeSymbolsFromText(this.email)
    if(this.endereco)
      this.endereco = this.removeSymbolsFromText(this.endereco)
    if(this.observacoes)
      this.observacoes = this.removeSymbolsFromText(this.observacoes)
    if(this.vendedor)
      this.vendedor = this.removeSymbolsFromText(this.vendedor)
  }

  private removeSymbolsFromText(info: string) {
    let text = info
    const map = { "â": "a", "Â": "A", "à": "a", "À": "A", "á": "a", "Á": "A", "ã": "a", "Ã": "A", "ê": "e", "Ê": "E", "è": "e", "È": "E", "é": "e", "É": "E", "î": "i", "Î": "I", "ì": "i", "Ì": "I", "í": "i", "Í": "I", "õ": "o", "Õ": "O", "ô": "o", "Ô": "O", "ò": "o", "Ò": "O", "ó": "o", "Ó": "O", "ü": "u", "Ü": "U", "û": "u", "Û": "U", "ú": "u", "Ú": "U", "ù": "u", "Ù": "U", "ç": "c", "Ç": "C" };
    // return text.replace(/[\W\[\] ]/g, function (a) { return map[a] || a }).toLowerCase()

    text = text.replace(new RegExp('[ÁÀÂÃ]','gi'), 'a');
    text = text.replace(new RegExp('[ÉÈÊ]','gi'), 'e');
    text = text.replace(new RegExp('[ÍÌÎ]','gi'), 'i');
    text = text.replace(new RegExp('[ÓÒÔÕ]','gi'), 'o');
    text = text.replace(new RegExp('[ÚÙÛ]','gi'), 'u');
    text = text.replace(new RegExp('[Ç]','gi'), 'c');

    return text;
  }

}
