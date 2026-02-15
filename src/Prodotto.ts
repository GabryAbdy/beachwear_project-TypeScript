// --- src/Prodotto.ts ---
import { StatoProdotto } from "./enums.js";
import { IEsito } from "./interfaces.js";
import type { Cliente } from "./Cliente.js";

export abstract class Prodotto {
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
    this.stato = stato;
    this.clienteAssegnato = clienteAssegnato;
  }

  /*
   * Restituisce una nuova istanza del prodotto con stato aggiornato e cliente assegnato.
   * Non modifica il prodotto esistente, ma ne crea una copia.
   */
  abstract assegnaProdotto(
    cliente: Cliente,
    nuovoStato?: StatoProdotto,
  ): IEsito<Prodotto>;
}

export class ProdottoStandard extends Prodotto {
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

export class ProdottoPersonalizzato extends Prodotto {
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
