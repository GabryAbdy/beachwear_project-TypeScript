// --- src/Prodotto.ts ---
import { StatoProdotto } from "./enums.js";
import type { IEsito } from "./interfaces.js";
import { Cliente } from "./Cliente.js";

// --- src/Prodotto.ts ---
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

  /**
   * Assegna il prodotto a un cliente.
   * Restituisce una nuova istanza con stato aggiornato senza modificare l'originale.
   */
  assegnaProdotto(
    cliente: Cliente,
    nuovoStato: StatoProdotto = StatoProdotto.Ordinato,
  ): IEsito<Prodotto> {
    // Validazione
    if (this.stato !== StatoProdotto.Disponibile || this.clienteAssegnato) {
      return {
        successo: false,
        messaggio: `[ERRORE DISPONIBILITÀ] Il prodotto ID ${this.ID} è ${this.stato} o già assegnato.`,
      };
    }

    // Creazione copia delegata alla sottoclasse
    return {
      successo: true,
      messaggio: "Prodotto assegnato correttamente.",
      dati: this.creaCopia(cliente, nuovoStato),
    };
  }

  /**
   * Metodo astratto per creare una copia del prodotto con nuovi valori.
   * Ogni sottoclasse implementa la propria logica di copia.
   */
  protected abstract creaCopia(
    cliente: Cliente,
    nuovoStato: StatoProdotto,
  ): Prodotto;
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

  protected creaCopia(cliente: Cliente, nuovoStato: StatoProdotto): Prodotto {
    return new ProdottoStandard(
      this.tipo,
      this.ID,
      this.taglia,
      this.colore,
      nuovoStato,
      cliente,
    );
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

  protected creaCopia(cliente: Cliente, nuovoStato: StatoProdotto): Prodotto {
    return new ProdottoPersonalizzato(
      this.tipo,
      this.ID,
      this.taglia,
      this.colore,
      nuovoStato,
      this.personalizzazione,
      this.sovrapprezzo,
      cliente,
    );
  }
}
