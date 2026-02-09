// --- src/main.ts ---
import { MetodoPagamento, StatoProdotto } from "./enums.js";
import { ProdottoStandard, ProdottoPersonalizzato } from "./Prodotto.js";
import { Cliente } from "./Cliente.js";
import { ProcessoProduzione } from "./ProcessoProduzione.js";
import { GestoreOrdini } from "./GestoreOrdini.js";

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
