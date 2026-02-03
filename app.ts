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

// Oggetto esito integrabile in una interfaccia grafica
interface IEsito<T = void> {
  successo: boolean;
  messaggio: string;
  dati?: T;
}

// --- CLASSI PRODOTTO ---

abstract class Prodotto {
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
    clienteAssegnato?: Cliente,
  ) {
    this.tipo = tipo;
    this.ID = ID;
    this.taglia = taglia;
    this.colore = colore;

    // Validazione Intrinseca Stato Prodotto
    const valoriPermessi = Object.values(StatoProdotto);
    if (!valoriPermessi.includes(stato)) {
      throw new Error(
        `[ERRORE STATO] Il prodotto ID ${this.ID} ha uno stato non riconosciuto.`,
      );
    }

    this.stato = stato;
    this.clienteAssegnato = clienteAssegnato;
  }

  /*
   * Restituisce esito contenente una nuova istanza del prodotto con stato aggiornato e cliente assegnato.
   * Non modifica il prodotto esistente, ma ne crea una copia.
   */
  abstract assegnaProdotto(
    cliente: Cliente,
    nuovoStato?: StatoProdotto,
  ): IEsito<Prodotto>;
}

class ProdottoStandard extends Prodotto {
  constructor(
    tipo: string,
    ID: number,
    taglia: string,
    colore: string,
    stato: StatoProdotto,
    clienteAssegnato?: Cliente,
  ) {
    super(tipo, ID, taglia, colore, stato, clienteAssegnato);
  }

  assegnaProdotto(
    cliente: Cliente,
    nuovoStato: StatoProdotto = StatoProdotto.Ordinato,
  ): IEsito<Prodotto> {
    // --- Validazione interna ---
    if (this.stato !== StatoProdotto.Disponibile || this.clienteAssegnato) {
      return {
        successo: false,
        messaggio: `[ERRORE DISPONIBILITÀ] Il prodotto ID ${this.ID} è ${this.stato} o già assegnato.`,
      };
    }
    return {
      successo: true,
      messaggio: "Prodotto assegnato correttamente.",
      dati: new ProdottoStandard(
        this.tipo,
        this.ID,
        this.taglia,
        this.colore,
        nuovoStato, // Nuovo valore passato come argomento
        cliente, // Cliente assegnato
      ),
    };
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
    clienteAssegnato?: Cliente,
  ) {
    super(tipo, ID, taglia, colore, stato, clienteAssegnato);
    this.personalizzazione = personalizzazione;
    this.sovrapprezzo = sovrapprezzo;
  }

  assegnaProdotto(
    cliente: Cliente,
    nuovoStato: StatoProdotto = StatoProdotto.Ordinato,
  ): IEsito<Prodotto> {
    // --- Validazione interna ---
    if (this.stato !== StatoProdotto.Disponibile || this.clienteAssegnato) {
      return {
        successo: false,
        messaggio: `[ERRORE DISPONIBILITÀ] Il prodotto ID ${this.ID} è ${this.stato} o già assegnato.`,
      };
    }
    return {
      successo: true,
      messaggio: "Prodotto assegnato correttamente.",
      dati: new ProdottoPersonalizzato(
        this.tipo,
        this.ID,
        this.taglia,
        this.colore,
        nuovoStato, // Nuovo valore passato come argomento
        this.personalizzazione,
        this.sovrapprezzo,
        cliente, // Cliente assegnato
      ),
    };
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
    metodoPagamento: MetodoPagamento,
  ) {
    this.nome = nome;
    this.cognome = cognome;

    // 1. Validazione Intrinseca Email
    const atIndex = email.indexOf("@");
    if (atIndex <= 0 || atIndex >= email.length - 1) {
      throw new Error(
        "[ERRORE VALIDAZIONE] L'email non è nel formato corretto.",
      );
    }
    this.email = email;

    // 2. Validazione Intrinseca Metodo di Pagamento Cliente
    const valoriPermessi = Object.values(MetodoPagamento);
    if (!valoriPermessi.includes(metodoPagamento)) {
      throw new Error(
        "[ERRORE VALIDAZIONE] Metodo di pagamento non supportato.",
      );
    }
    this.metodoPagamento = metodoPagamento;
  }

  // Avvia la procedura di acquisto, ma delega l'esecuzione al gestore ordini.
  ordinaProdotto(
    prodotto: Prodotto,
    gestore: GestoreOrdini,
  ): IEsito<{ prodotto: Prodotto; processoAggiornato: ProcessoProduzione }> {
    return gestore.eseguiOrdine(this, prodotto);
  }
}

// --- PROCESSO DI PRODUZIONE ---

class ProcessoProduzione {
  readonly nome: string;
  readonly descrizione: string;
  readonly prodottiProduzione: Prodotto[];

  constructor(
    nome: string,
    descrizione: string,
    prodottiProduzione: Prodotto[],
  ) {
    this.nome = nome;
    this.descrizione = descrizione;
    this.prodottiProduzione = prodottiProduzione;
  }

  /*
   * Restituisce esito contenente una nuova istanza del processo di produzione con la lista di prodotti aggiornata.
   * Non modifica l'array esistente.
   */
  aggiornaProcesso(prodottoAggiornato: Prodotto): IEsito<ProcessoProduzione> {
    // Verifica Esistenza Prodotto
    const esiste = this.prodottiProduzione.some(
      (p) => p.ID === prodottoAggiornato.ID,
    );
    if (!esiste) {
      return {
        successo: false,
        messaggio: `[ERRORE AGGIORNAMENTO] Prodotto ID ${prodottoAggiornato.ID} non trovato in questa linea.`,
      };
    }

    // Esecuzione
    const nuovaListaProdotti = this.prodottiProduzione.map((p) =>
      p.ID === prodottoAggiornato.ID ? prodottoAggiornato : p,
    );

    return {
      successo: true,
      messaggio: "Processo aggiornato con successo",
      dati: new ProcessoProduzione(
        this.nome,
        this.descrizione,
        nuovaListaProdotti,
      ),
    };
  }

  /*
   * Effettua doppia verifica sul prodotto.
   * Restituisce esito contenente una nuova istanza del processo di produzione con il nuovo prodotto.
   */
  aggiungiProdotto(prodottoNuovo: Prodotto): IEsito<ProcessoProduzione> {
    // ---  VERIFICA PRODOTTO ---
    // 1. Verifica ID
    const conflittoID = this.prodottiProduzione.find(
      (e) => e.ID === prodottoNuovo.ID,
    );

    // 2. Verifica Duplicato - Errore Battitura
    if (conflittoID) {
      const duplicati =
        JSON.stringify(conflittoID) === JSON.stringify(prodottoNuovo);
      if (!duplicati) {
        // 2.1 Errore Battitura
        return {
          successo: false,
          messaggio: `[CONFLITTO ID] L'ID ${prodottoNuovo.ID} è già assegnato ad un altro prodotto.`,
        };
      } else {
        // 2.2 Prodotto Duplicato
        return {
          successo: false,
          messaggio: `[DUPLICATO] il prodotto ID ${prodottoNuovo.ID} è già presente.`,
        };
      }
    }

    // --- ESECUZIONE ---
    const nuovaListaProdotti = [...this.prodottiProduzione, prodottoNuovo];

    return {
      successo: true,
      messaggio: `[SUCCESSO] Prodotto ID: ${prodottoNuovo.ID} messo in produzione.`,
      dati: new ProcessoProduzione(
        this.nome,
        this.descrizione,
        nuovaListaProdotti,
      ),
    };
  }
}

// --- LOGICA DI GESTIONE ---

class GestoreOrdini {
  private _processi: ProcessoProduzione[];

  constructor(processi: ProcessoProduzione[]) {
    this._processi = processi;
  }

  /*
   * Riceve l'ordine dal cliente.
   * Elabora l'ordine e restituisce esito integrabile in una interfaccia grafica.
   */
  eseguiOrdine(
    cliente: Cliente,
    prodotto: Prodotto,
  ): IEsito<{ prodotto: Prodotto; processoAggiornato: ProcessoProduzione }> {
    // --- 1. Ricerca Processo Produttivo Interessato ---
    const processoInteressato = this._processi.find((processo) =>
      processo.prodottiProduzione.some((p) => p.ID === prodotto.ID),
    );
    if (!processoInteressato) {
      return {
        successo: false,
        messaggio: `[ERRORE RICERCA] Nessun processo trovato per il prodotto ID ${prodotto.ID}.`,
      };
    }

    // --- 2. ELABORAZIONE ORDINE ---
    // 2.1 Assegnazione (Responsabilità del Prodotto)
    const esito = prodotto.assegnaProdotto(cliente);
    if (!esito.successo) {
      return {
        successo: false,
        messaggio: esito.messaggio,
      };
    }

    const prodottoAggiornato = esito.dati!;

    // 2.2 Aggiornamento Linea (Responsabilità del Processo)
    const esitoAggiornamento =
      processoInteressato.aggiornaProcesso(prodottoAggiornato);
    if (!esitoAggiornamento.successo || !esitoAggiornamento.dati) {
      return {
        successo: false,
        messaggio: esitoAggiornamento.messaggio,
      };
    }

    // 2.4 Aggiornamento Processi Interni Gestore (Responsabilità del Gestore)
    const processoAggiornato = esitoAggiornamento.dati;
    this._processi = this._processi.map((p) =>
      p === processoInteressato ? processoAggiornato : p,
    );

    // --- ESITO ---
    return {
      successo: true,
      messaggio: `[SUCCESSO] Ordine completato: il prodotto ID ${prodotto.ID} è stato assegnato a ${cliente.nome} ${cliente.cognome}.`,
      dati: {
        prodotto: prodottoAggiornato,
        processoAggiornato,
      },
    };
  }

  // Metodo per aggiungere un nuovo prodotto alle linee produttive aggiornate
  aggiungiProdottoAProcesso(
    nomeProcesso: string,
    nuovoProdotto: Prodotto,
  ): IEsito<ProcessoProduzione> {
    // Verifica Esistenza Processo
    const processoTrovato = this._processi.find((p) => p.nome === nomeProcesso);
    if (!processoTrovato) {
      return {
        successo: false,
        messaggio: `[ERRORE] La linea "${nomeProcesso}" non esiste nel sistema.`,
      };
    }

    // Aggiornamento dello stato
    const indice = this._processi.indexOf(processoTrovato);
    const esito = processoTrovato.aggiungiProdotto(nuovoProdotto);
    if (esito.successo) {
      this._processi = [
        ...this._processi.slice(0, indice),
        esito.dati!,
        ...this._processi.slice(indice + 1),
      ];
    }

    // Risultato
    return esito;
  }

  // Metodo di Riepilogo per UI
  riepilogoStatoSistema(): string[] {
    return this._processi.map((p) => {
      const numeroProdotti = p.prodottiProduzione.length;
      const ultimoID = p.prodottiProduzione.at(-1)?.ID || "Nessuno";
      return `${p.nome}: ${numeroProdotti} prodotti presenti (ultimo ID: ${ultimoID}).`;
    });
  }

  // Getter Processi del Gestore
  get processi(): ProcessoProduzione[] {
    return [...this._processi];
  }
}

// --- ISTANZE TEST ---

// Istanze Prodotto
const costumeRelax = new ProdottoStandard(
  "boxer",
  101,
  "L",
  "Blu",
  StatoProdotto.Disponibile,
);
const costumeActive = new ProdottoStandard(
  "costume intero",
  102,
  "S",
  "Rosso",
  StatoProdotto.Esaurito,
);
const costumeExtreme = new ProdottoPersonalizzato(
  "costume intero",
  103,
  "M",
  "Nero",
  StatoProdotto.Disponibile,
  "Nome ricamato: Luca Rossi",
  5,
);
const costumeKids = new ProdottoStandard(
  "boxer",
  201,
  "5 anni",
  "Giallo",
  StatoProdotto.Disponibile,
);

// Istanze Cliente
const cliente1 = new Cliente(
  "Marta",
  "Bianchi",
  "dbianchi@mail.com",
  MetodoPagamento.Bancomat,
);
const cliente2 = new Cliente(
  "Luca",
  "Rossi",
  "lucarossi@atleta.com",
  MetodoPagamento.Carta,
);

// Istanze ProcessoProduzione
const lineaAdulti = new ProcessoProduzione(
  "Linea Ocean",
  "Linea sostenibile di prodotti beachwear realizzati in plastica riciclata per adulti",
  [costumeRelax, costumeActive, costumeExtreme],
);
const lineaKids = new ProcessoProduzione(
  "Linea Sea",
  "Linea sostenibile di prodotti beachwear per bambini",
  [costumeKids],
);

// --- SETUP GESTORE ORDINI ---
const gestoreOrdiniSunnee = new GestoreOrdini([lineaAdulti, lineaKids]);

// --- TEST ORDINI
console.info(" --- TEST ORDINI ---");

// Test Ordine Prodotto Disponibile
console.group("// Test Ordine Prodotto Disponibile //");
console.log("Stato pre-ordine prodotto costumeExtreme:", costumeExtreme.stato);
const ordineOk = cliente2.ordinaProdotto(costumeExtreme, gestoreOrdiniSunnee);

if (ordineOk.successo && ordineOk.dati) {
  console.log(ordineOk.messaggio);
} else {
  console.warn("Errore durante l'ordine:", ordineOk.messaggio);
}
console.groupEnd();

// Test Ordine Prodotto Non Disponibile
console.group("// Test Ordine Prodotto Non Disponibile //");
console.log("Stato pre-ordine prodotto costumeActive:", costumeActive.stato);
const ordineNonDisponibile = cliente1.ordinaProdotto(
  costumeActive,
  gestoreOrdiniSunnee,
);

if (ordineNonDisponibile.successo && ordineNonDisponibile.dati) {
  console.log(ordineNonDisponibile.messaggio);
} else {
  console.warn(
    "Errore intercettato correttamente:",
    ordineNonDisponibile.messaggio,
  );
}
console.groupEnd();

// Test Cliente con Errore di Validazione
console.group("// Test Cliente con Errore di Validazione //");
console.info("Verifico che un'email non valida blocchi l'ordine...");

try {
  const clienteErrore = new Cliente(
    "Tony",
    "Stark",
    "iam.ironman", // Email senza @
    MetodoPagamento.Contanti,
  );
  console.error(
    "Test fallito: il sistema ha creato un cliente con email non valida.",
  );
} catch (errore) {
  if (errore instanceof Error) {
    console.log("Test superato: errore intercettato correttamente.");
    console.warn(`Dettaglio errore: ${errore.message}`);
  } else {
    console.error("È successo qualcosa di imprevisto!");
  }
}
console.groupEnd();

// --- TEST AGGIUNTA NUOVO PRODOTTO ---
console.log(" --- TEST AGGIUNTA NUOVO PRODOTTO ---");
const nuovoCostumeKids = new ProdottoStandard(
  "slip",
  202,
  "8 anni",
  "Verde",
  StatoProdotto.Disponibile,
);

// Test Ordine Prodotto NON Inserito in Processo Produzione
console.group("// Test Ordine Prodotto NON Inserito in Processo Produzione //");
console.info(
  "Verifico che l'ordine di un prodotto non censito venga bloccato...",
);

const prodottoNonTrovato = cliente1.ordinaProdotto(
  nuovoCostumeKids,
  gestoreOrdiniSunnee,
);

if (!prodottoNonTrovato.successo) {
  console.warn(
    "Errore intercettato correttamente:",
    prodottoNonTrovato.messaggio,
  );
  console.log(
    "Test superato: il sistema ha impedito l'ordine di un prodotto non censito.",
  );
} else {
  console.error(
    "Test fallito: il sistema ha consentito un ordine per un prodotto non presente in produzione.",
  );
}
console.groupEnd();

// Test Aggiunta Nuovo Prodotto a Processo Produzione
console.group("// Test Aggiunta Nuovo Prodotto a Processo Produzione //");
console.log(
  "Stato iniziale Linea Sea:",
  lineaKids.prodottiProduzione.length,
  "prodotti",
);
console.info(
  "Espansione della Linea Sea con il nuovo prodotto ID:",
  nuovoCostumeKids.ID,
);

const esitoAggiunta = gestoreOrdiniSunnee.aggiungiProdottoAProcesso(
  "Linea Sea",
  nuovoCostumeKids,
);

if (esitoAggiunta.successo && esitoAggiunta.dati) {
  console.log(esitoAggiunta.messaggio);
  console.log(
    "Nuovo conteggio prodotti Linea Sea:",
    esitoAggiunta.dati.prodottiProduzione.length,
    "prodotti",
  );
} else {
  console.error(
    "Test fallito: errore imprevisto nell'aggiunta:",
    esitoAggiunta.messaggio,
  );
}
console.groupEnd();

// --- TEST STATO GESTORE ORDINI ---
console.group("--- TEST STATO GESTORE ORDINI ---");

const processiNuovi = gestoreOrdiniSunnee.processi;
const lineaBambini = processiNuovi.find((p) => p.nome === "Linea Sea");
const ultimoProdotto = lineaBambini?.prodottiProduzione.at(-1);

// Verifica Logica
console.info("// Verifica Logica //");

const isConteggioCorretto = lineaBambini?.prodottiProduzione.length === 2;
const isIDCOrretto = ultimoProdotto?.ID === nuovoCostumeKids.ID;

if (isConteggioCorretto && isIDCOrretto) {
  console.log(
    "✅ Stato del sistema coerente con le modifiche (Conteggio: 2; Ultimo ID: 202).",
  );
} else {
  console.error(
    "Dati incoerenti: i valori attesi non corrispondono a quelli reali.",
  );
}

// Riepilogo per UI
console.info("// Riepilogo per UI //");
const riepilogo = gestoreOrdiniSunnee.riepilogoStatoSistema();
riepilogo.forEach((riga) => console.log(`> ${riga}`));
console.groupEnd();
