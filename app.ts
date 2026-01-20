// --- ENUM ---

enum MetodoPagamento {
  Contanti = "contanti",
  Carta = "carta di credito",
  Bancomat = "bancomat",
}

enum StatoProdotto {
  Disponibile = "disponibile",
  Ordinato = "ordinato",
  Esaurito = "esaurito",
}

// --- INTERFACCE ---

interface IProdotto {
  tipo: string;
  ID: number;
  taglia: string;
  colore: string;
  stato: StatoProdotto;
  clienteAssegnato?: Cliente;

  assegnaProdotto(cliente: Cliente, nuovoStato?: StatoProdotto): IProdotto;
}

interface IProcessoProduzione {
  nome: string;
  descrizione: string;
  prodottiProduzione: IProdotto[];

  aggiornaLista(prodottoAggiornato: IProdotto): IProcessoProduzione;
  aggiungiProdotto(prodotto: IProdotto): IProcessoProduzione;
}

// Oggetto integrabile in una interfaccia grafica
interface IEsitoOrdine {
  successo: boolean;
  messaggio: string;
  prodotto?: IProdotto; // Il prodotto aggiornato
  processoAggiornato?: IProcessoProduzione; // Il processo di produzione aggiornato
}

// --- CLASSI PRODOTTO ---

abstract class Prodotto implements IProdotto {
  readonly tipo: string;
  readonly ID: number;
  readonly taglia: string;
  readonly colore: string;
  readonly stato: StatoProdotto;
  readonly clienteAssegnato?: Cliente | undefined;

  constructor(
    tipo: string,
    ID: number,
    taglia: string,
    colore: string,
    stato: StatoProdotto,
    clienteAssegnato?: Cliente
  ) {
    this.tipo = tipo;
    this.ID = ID;
    this.taglia = taglia;
    this.colore = colore;
    this.stato = stato;
    this.clienteAssegnato = clienteAssegnato;
  }

  /* Restituisce una nuova istanza del prodotto con stato aggiornato e cliente assegnato. 
   * Non modifica il prodotto esistente, ma ne crea una copia. */
  abstract assegnaProdotto(
    cliente: Cliente,
    nuovoStato?: StatoProdotto
  ): IProdotto;
}

class ProdottoStandard extends Prodotto {
  constructor(
    tipo: string,
    ID: number,
    taglia: string,
    colore: string,
    stato: StatoProdotto,
    clienteAssegnato?: Cliente
  ) {
    super(tipo, ID, taglia, colore, stato, clienteAssegnato);
  }

  assegnaProdotto(
    cliente: Cliente,
    nuovoStato: StatoProdotto = StatoProdotto.Ordinato
  ): IProdotto {
    return new ProdottoStandard(
      this.tipo,
      this.ID,
      this.taglia,
      this.colore,
      nuovoStato, // Nuovo valore passato come argomento
      cliente // Cliente assegnato
    );
  }
}

class ProdottoPersonalizzato extends Prodotto {
  readonly personalizzazione: string;
  readonly sovrapprezzo: number;

  constructor(
    tipo: string,
    ID: number,
    taglia: string,
    colore: string,
    stato: StatoProdotto,
    personalizzazione: string,
    sovrapprezzo: number,
    clienteAssegnato?: Cliente
  ) {
    super(tipo, ID, taglia, colore, stato, clienteAssegnato);
    this.personalizzazione = personalizzazione;
    this.sovrapprezzo = sovrapprezzo;
  }

  assegnaProdotto(
    cliente: Cliente,
    nuovoStato: StatoProdotto = StatoProdotto.Ordinato
  ): IProdotto {
    return new ProdottoPersonalizzato(
      this.tipo,
      this.ID,
      this.taglia,
      this.colore,
      nuovoStato, // Nuovo valore passato come argomento
      this.personalizzazione,
      this.sovrapprezzo,
      cliente // Cliente assegnato
    );
  }
}

// --- CLASSE CLIENTE ---

class Cliente {
  nome: string;
  cognome: string;
  email: string;
  metodoPagamento: MetodoPagamento;

  constructor(
    nome: string,
    cognome: string,
    email: string,
    metodoPagamento: MetodoPagamento
  ) {
    this.nome = nome;
    this.cognome = cognome;
    this.email = email;
    this.metodoPagamento = metodoPagamento;
  }

  // Avvia la procedura di acquisto, ma delega l'esecuzione al gestore ordini.
  ordinaProdotto(prodotto: IProdotto, gestore: GestoreOrdini): IEsitoOrdine {
    return gestore.eseguiOrdine(this, prodotto);
  }
}

// --- PROCESSO DI PRODUZIONE ---

class ProcessoProduzione implements IProcessoProduzione {
  readonly nome: string;
  readonly descrizione: string;
  readonly prodottiProduzione: IProdotto[];

  constructor(
    nome: string,
    descrizione: string,
    prodottiProduzione: IProdotto[]
  ) {
    this.nome = nome;
    this.descrizione = descrizione;
    this.prodottiProduzione = prodottiProduzione;
  }

  /* Restituisce una nuova istanza del processo di produzione con la lista di prodotti aggiornata.
   * Non modifica l'array esistente. */
  aggiornaLista(prodottoAggiornato: IProdotto): IProcessoProduzione {
    const nuovaLista = this.prodottiProduzione.map((p) => {
      if (p.ID === prodottoAggiornato.ID) {
        return prodottoAggiornato;
      } else {
        return p;
      }
    });
    return new ProcessoProduzione(this.nome, this.descrizione, nuovaLista);
  }

  /* Effettua doppia verifica sul prodotto, se già esistente oppure contiene un errore di battitura.
   * Restituisce una nuova istanza del processo di produzione con il nuovo prodotto. */
  aggiungiProdotto(prodottoNuovo: IProdotto): IProcessoProduzione {
    // --- VERIFICA PRODOTTO ---

    // Verifica ID
    const prodottoEsistente = this.prodottiProduzione.find(
      (e) => e.ID === prodottoNuovo.ID
    );

    // Verifica Duplicato - Errore Battitura
    if (prodottoEsistente) {
      const duplicati =
        JSON.stringify(prodottoEsistente) === JSON.stringify(prodottoNuovo);
      if (!duplicati) {
        // Errore Battitura
        console.error(
          `[CONFLITTO ID] L'ID ${prodottoNuovo.ID} è già assegnato ad un altro prodotto.`
        );
        console.log("Prodotto esistente: ", prodottoEsistente);
        console.log("Prodotto nuovo in conflitto: ", prodottoNuovo);
      } else {
        // Prodotto Duplicato
        console.error(
          `[DUPLICATO] il prodotto ID ${prodottoNuovo.ID} è già presente.`
        );
      }
      return this;
    }
    const nuovaLista = [...this.prodottiProduzione, prodottoNuovo];
    console.log(`Prodotto ID: ${prodottoNuovo.ID} messo in produzione.`);
    return new ProcessoProduzione(this.nome, this.descrizione, nuovaLista);
  }
}

// --- LOGICA DI GESTIONE ---

class GestoreOrdini {
  private processi: IProcessoProduzione[];

  constructor(processi: IProcessoProduzione[]) {
    this.processi = processi;
  }

  /* Riceve l'ordine dal cliente.
   * Restituisce un oggetto integrabile in una interfaccia grafica. */
  eseguiOrdine(cliente: Cliente, prodotto: IProdotto): IEsitoOrdine {
    // --- VALIDAZIONE ---

    // Controllo Email
    const atIndex = cliente.email.indexOf("@");
    if (atIndex <= 0 || atIndex >= cliente.email.length - 1) {
      console.error(
        `[ERRORE VALIDAZIONE] L'email non è nel formato corretto: ${cliente.email}.`
      );
      return {
        successo: false,
        messaggio: "Email non valida",
      };
    }

    // Controllo Disponibilità Prodotto
    if (
      prodotto.stato !== StatoProdotto.Disponibile ||
      prodotto.clienteAssegnato
    ) {
      console.error(
        `[ERRORE DISPONIBILITÀ] Il prodotto ID ${prodotto.ID} è ${prodotto.stato} o già assegnato.`
      );
      return {
        successo: false,
        messaggio: "Il prodotto non è disponibile",
      };
    }

    // Ricerca Processo Produttivo Interessato
    const processoInteressato = this.processi.find((processo) =>
      processo.prodottiProduzione.some((p) => p.ID === prodotto.ID)
    );
    if (!processoInteressato) {
      console.error(
        `[ERRORE RICERCA] Nessun processo trovato per il prodotto ID ${prodotto.ID}.`
      );
      return {
        successo: false,
        messaggio:
          "Errore: non è stato trovato alcun processo relativo al prodotto interessato.",
      };
    }

    // --- ELABORAZIONE ORDINE ---

    // Aggiornamento Stato Prodotto
    const prodottoAggiornato = prodotto.assegnaProdotto(cliente);

    // Aggiornamento Stato Gestore
    const processoAggiornato =
      processoInteressato.aggiornaLista(prodottoAggiornato);

    this.processi = this.processi.map((p) =>
      p === processoInteressato ? processoAggiornato : p
    );

    // --- ESITO ---

    return {
      successo: true,
      messaggio: "Ordine completato e processo aggiornato",
      prodotto: prodottoAggiornato,
      processoAggiornato: processoAggiornato,
    };
  }

  // Metodo per aggiungere un nuovo prodotto alle linee produttive aggiornate
  aggiungiProdottoAProcesso(
    nomeProcesso: string,
    nuovoProdotto: IProdotto
  ): void {
    // Verifica Esistenza Processo
    const esiste = this.processi.some((p) => p.nome === nomeProcesso);
    if (!esiste) {
      console.error(
        `[ERRORE] La linea "${nomeProcesso}" non esiste nel sistema.`
      );
      return;
    }
    this.processi = this.processi.map((p) => {
      if (p.nome === nomeProcesso) {
        return p.aggiungiProdotto(nuovoProdotto);
      }
      return p;
    });
  }

  // Metodo "getter" per visualizzare i processi aggiornati
  getStatoSistema(): void {
    console.log(" --- RIEPILOGO PROCESSI SUNNEE ---");
    this.processi.forEach((p) => {
      console.log(p.nome);
      p.prodottiProduzione.forEach((prod) => {
        console.log(prod);
      });
    });
  }
}

// --- ISTANZE TEST ---

// Istanze Prodotto
const costumeRelax = new ProdottoStandard(
  "boxer",
  101,
  "L",
  "Blu",
  StatoProdotto.Disponibile
);
const costumeActive = new ProdottoStandard(
  "costume intero",
  102,
  "S",
  "Rosso",
  StatoProdotto.Esaurito
);
const costumeExtreme = new ProdottoPersonalizzato(
  "costume intero",
  103,
  "M",
  "Nero",
  StatoProdotto.Disponibile,
  "Nome ricamato: Luca Rossi",
  5
);
const costumeKids = new ProdottoStandard(
  "boxer",
  201,
  "5 anni",
  "Giallo",
  StatoProdotto.Disponibile
);

// Istanze Cliente
const cliente1 = new Cliente(
  "Marta",
  "Bianchi",
  "dbianchi@mail.com",
  MetodoPagamento.Bancomat
);
const cliente2 = new Cliente(
  "Luca",
  "Rossi",
  "lucarossi@atleta.com",
  MetodoPagamento.Carta
);
const clienteErrore = new Cliente(
  "Tony",
  "Stark",
  "iam.ironman",
  MetodoPagamento.Contanti
);

// Istanze ProcessoProduzione
const lineaAdulti = new ProcessoProduzione(
  "Linea Ocean",
  "Linea sostenibile di prodotti beachwear realizzati in plastica riciclata per adulti",
  [costumeRelax, costumeActive, costumeExtreme]
);
const lineaKids = new ProcessoProduzione(
  "Linea Sea",
  "Linea sostenibile di prodotti beachwear per bambini",
  [costumeKids]
);

// --- SETUP GESTORE ORDINI ---
const gestoreOrdiniSunnee = new GestoreOrdini([lineaAdulti, lineaKids]);

// --- TEST ORDINI
console.log(" --- TEST ORDINI ---");

// Test Ordine Prodotto Disponibile
console.log("// Test Ordine Prodotto Disponibile //");
console.log("Stato prodotto costumeExtreme:", costumeExtreme.stato);
const ordineOk = cliente2.ordinaProdotto(costumeExtreme, gestoreOrdiniSunnee);
console.log("Esito ordine:", ordineOk);

// Test Ordine Prodotto Non Disponibile
console.log("// Test Ordine Prodotto Non Disponibile //");
console.log("Stato prodotto costumeActive:", costumeActive.stato);
const ordineNonDisponibile = cliente1.ordinaProdotto(
  costumeActive,
  gestoreOrdiniSunnee
);
console.log("Esito ordine:", ordineNonDisponibile);

// Test Cliente con Errore di Validazione
console.log("// Test Cliente con Errore di Validazione //");
const ordineFallito = clienteErrore.ordinaProdotto(
  costumeExtreme,
  gestoreOrdiniSunnee
);
console.log("Esito ordine:", ordineFallito);

// --- TEST STATO GESTORE ORDINI ---
gestoreOrdiniSunnee.getStatoSistema();

// --- TEST AGGIUNTA NUOVO PRODOTTO ---
console.log(" --- TEST AGGIUNTA NUOVO PRODOTTO ---");
const nuovoCostumeKids = new ProdottoStandard(
  "slip",
  202,
  "8 anni",
  "Verde",
  StatoProdotto.Disponibile
);

// Test Ordine Prodotto Non Inserito in Processo Produzione
console.log("// Test Ordine Prodotto Non Inserito in Processo Produzione");
const prodottoNonTrovato = cliente1.ordinaProdotto(
  nuovoCostumeKids,
  gestoreOrdiniSunnee
);
console.log("Esito ordine:", prodottoNonTrovato);

// Test Aggiunta Nuovo Prodotto a Processo Produzione
console.log("// Test Aggiunta Nuovo Prodotto a Processo Produzione");
gestoreOrdiniSunnee.aggiungiProdottoAProcesso("Linea Sea", nuovoCostumeKids);

// Verifica
gestoreOrdiniSunnee.getStatoSistema();
