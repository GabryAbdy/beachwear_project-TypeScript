// --- src/interfaces.ts ---
export interface IEsito<T = void> {
  successo: boolean;
  messaggio: string;
  dati?: T;
}
