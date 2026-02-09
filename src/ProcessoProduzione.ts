// --- src/ProcessoProduzione.ts ---
import { IEsito } from "./interfaces.js";
import { Prodotto } from "./Prodotto.js";

export class ProcessoProduzione {
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
   * Restituisce una nuova istanza del processo di produzione con la lista di prodotti aggiornata.
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
   * Restituisce una nuova istanza del processo di produzione con il nuovo prodotto.
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
