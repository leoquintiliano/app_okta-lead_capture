export class Lead {
  id: number | undefined
  nome: string | undefined
  primeiroContato: string | undefined
  ultimoContato: string | undefined
  dataNascimento?: string | undefined

  celular: string | undefined
  telefone: string | undefined
  endereco: string | undefined
  email: string | undefined

  uf: string | undefined
  cidade: string | undefined
  carroInteresse1: string | undefined
  carroInteresse2: string | undefined
  carroInteresse3: string | undefined
  carroAtual1: string | undefined
  carroAtual2: string | undefined
  carroAtual3: string | undefined
  vendedor: string | undefined
  status: string | undefined
  opcaoVeiculo: string | undefined

  observacoes: string | undefined

  diasCadastro: number | undefined
  diasUltimoContato: number | undefined

  constructor(id?: number | undefined, nome?: string | undefined, primeiroContato?: string | undefined, ultimoContato?: string | undefined, dataNascimento?: string | undefined, celular?: string | undefined, telefone?: string | undefined,
              endereco?: string | undefined, email?: string | undefined,  uf?: string | undefined, cidade?: string | undefined, carroInteresse1?: string | undefined, carroInteresse2?: string | undefined, carroInteresse3?: string | undefined,
              carroAtual1?: string | undefined, carroAtual2?: string | undefined, carroAtual3?: string | undefined, vendedor?: string | undefined, status?: string | undefined, opcaoVeiculo?: string | undefined, observacoes?: string | undefined, diasCadastro?: number | undefined, diasUltimoContato?: number | undefined) {
    this.id = id
    this.nome = nome;
    this.primeiroContato = primeiroContato;
    this.ultimoContato = ultimoContato;
    this.dataNascimento = dataNascimento;
    this.celular = celular;
    this.telefone = telefone;
    this.email = email
    this.endereco = endereco
    this.uf = uf;
    this.cidade = cidade;
    this.carroInteresse1 = carroInteresse1;
    this.carroInteresse2 = carroInteresse2;
    this.carroInteresse3 = carroInteresse3;
    this.carroAtual1 = carroAtual1;
    this.carroAtual2 = carroAtual2;
    this.carroAtual3 = carroAtual3;
    this.vendedor = vendedor;
    this.status = status
    this.opcaoVeiculo = opcaoVeiculo
    this.observacoes = observacoes
    this.diasCadastro = diasCadastro
    this.diasUltimoContato = diasUltimoContato
  }

}
