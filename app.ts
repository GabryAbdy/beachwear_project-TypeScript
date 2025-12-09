// Interfacce

interface IProdotto {
  tipo: string;
  ID: number;
  taglia: string;
  colore: string;
  stato: string;
  clienteAssegnato?: ICliente;

  assegnaCliente(cliente: ICliente): void;
}

interface ICliente {
  nome: string;
  cognome: string;
  email: string;
  metodoPagamento: string;

  ordinaProdotto(prodotto: IProdotto): void;
}

interface IProcessoProduzione {
  nome: string;
  descrizione: string;
  prodottiProduzione: IProdotto[];

  aggiungiProdotto(prodotto: IProdotto): void;
}

// Classi

class Prodotto implements IProdotto {
  tipo: string;
  ID: number;
  taglia: string;
  colore: string;
  stato: string;
  clienteAssegnato?: ICliente | undefined;

  constructor(
    tipo: string,
    ID: number,
    taglia: string,
    colore: string,
    stato: string
  ) {
    this.tipo = tipo;
    this.ID = ID;
    this.taglia = taglia;
    this.colore = colore;
    this.stato = stato;
  }

  assegnaCliente(cliente: ICliente): void {
    this.stato = "ordinato";
    this.clienteAssegnato = cliente;
    console.log(`Prodotto (ID: ${this.ID}): ordinato.`);
  }
}

class Cliente implements ICliente {
  nome: string;
  cognome: string;
  email: string;
  metodoPagamento: string;

  constructor(
    nome: string,
    cognome: string,
    email: string,
    metodoPagamento: string
  ) {
    this.nome = nome;
    this.cognome = cognome;
    this.email = email;
    this.metodoPagamento = metodoPagamento;
  }

  ordinaProdotto(prodotto: IProdotto): void {
    if (prodotto.stato === "disponibile") {
      prodotto.assegnaCliente(this);
      console.log(
        `Ordine riuscito! ${this.nome} ${this.cognome} ha acquistato: ${prodotto.tipo} (ID: ${prodotto.ID}).`
      );
    } else {
      console.log(
        `Ordine fallito per ${this.nome} ${this.cognome}. Il prodotto ${prodotto.tipo} (ID: ${prodotto.ID}) non è disponibile. Stato attuale: ${prodotto.stato}.`
      );
    }
  }
}

class ProcessoProduzione implements IProcessoProduzione {
  nome: string;
  descrizione: string;
  prodottiProduzione: IProdotto[];

  constructor(
    nome: string,
    descrizione: string,
    prodottiProduzione: IProdotto[]
  ) {
    this.nome = nome;
    this.descrizione = descrizione;
    this.prodottiProduzione = prodottiProduzione;
  }

  aggiungiProdotto(prodotto: IProdotto): void {
    const prodottoEsistente = this.prodottiProduzione.find(
      (e) => e.ID === prodotto.ID
    );

    if (prodottoEsistente) {
      console.log(`Prodotto (ID: ${prodotto.ID}) già in produzione.`);
      return;
    } else {
      this.prodottiProduzione.push(prodotto);
      console.log(`Prodotto (ID: ${prodotto.ID}) messo in produzione.`);
    }
  }
}

// Istanze Prodotto

let costumeDaBagno1 = new Prodotto(
  "costume da bagno",
  1,
  "S",
  "blu",
  "disponibile"
);
let costumeDaBagno2 = new Prodotto(
  "costume da bagno",
  2,
  "M",
  "verde",
  "esaurito"
);
let pareo = new Prodotto("pareo", 3, "S", "rosso", "disponibile");
let cappello1 = new Prodotto("cappello", 4, "unica", "bianco", "disponibile");
let cappello2 = new Prodotto("cappello", 5, "unica", "beige", "esaurito");

// Istanze Cliente

let cliente1 = new Cliente(
  "Marco",
  "Rossi",
  "marcorossi@mail.com",
  "carta di credito"
);
let cliente2 = new Cliente(
  "Delia",
  "Bianchi",
  "deliabianchi@mail.com",
  "bancomat"
);
let cliente3 = new Cliente(
  "Sonia",
  "Gialli",
  "soniagialli@mail.com",
  "contanti"
);

// Istanze ProcessoProduzione

let processoBeachwear = new ProcessoProduzione(
  "beachwear",
  "processo di produzione articoli beachwear",
  [costumeDaBagno1, costumeDaBagno2, pareo]
);
let processoCappelli = new ProcessoProduzione(
  "cappelli",
  "processo di produzione cappelli",
  [cappello1, cappello2]
);

// Test prodotto disponibile
console.log(costumeDaBagno1.stato); // stato pre-ordine
cliente1.ordinaProdotto(costumeDaBagno1);
console.log(costumeDaBagno1.stato); // stato post-ordine

// Test prodotto esaurito
console.log(costumeDaBagno2.stato); // stato pre-ordine
cliente2.ordinaProdotto(costumeDaBagno2);
console.log(costumeDaBagno2.stato); // stato post-ordine
cliente2.ordinaProdotto(costumeDaBagno1); // ordine fallito, prodotto già ordinato

// Test aggiunta prodotto
console.log(processoCappelli.prodottiProduzione); // prodotti nell'array pre-aggiunta
let nuovoCappello = new Prodotto(
  "cappello",
  6,
  "unica",
  "grigio",
  "disponibile"
);
processoCappelli.aggiungiProdotto(nuovoCappello);
console.log(processoCappelli.prodottiProduzione); // prodotti nell'array post-aggiunta

// Test ordine nuovo prodotto
console.log(nuovoCappello.stato); // stato pre-ordine
cliente3.ordinaProdotto(nuovoCappello);
console.log(nuovoCappello.stato); // stato post-ordine
