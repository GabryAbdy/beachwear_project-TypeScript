// --- src/Cliente.ts ---
import type { MetodoPagamento } from "./enums.js";
import type { IEsito } from "./interfaces.js";
import type { Prodotto } from "./Prodotto.js";
import type { ProcessoProduzione } from "./ProcessoProduzione.js";
import type { GestoreOrdini } from "./GestoreOrdini.js";

export class Cliente {
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
