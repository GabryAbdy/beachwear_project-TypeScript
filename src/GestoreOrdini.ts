// --- src/GestoreOrdini.ts ---
import { IEsito } from "./interfaces.js";
import type { Prodotto } from "./Prodotto.js";
import type { Cliente } from "./Cliente.js";
import { ProcessoProduzione } from "./ProcessoProduzione.js";

export class GestoreOrdini {
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
