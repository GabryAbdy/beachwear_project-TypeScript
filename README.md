# Sunnee Beachwear - Sustainable Management System (v2.0)

This TypeScript project simulates the management system for **Sunnee**, an eco-friendly beachwear brand. Version 2.0 represents a radical evolution from the initial prototype, adopting functional and defensive programming paradigms.

## Key Refactoring Improvements (What's New in v2.0)

Compared to the previous version, the code has been entirely rewritten to implement:

- **State Immutability**: Methods no longer modify existing objects. Instead, they return new updated instances. This ensures operation traceability and prevents bugs related to shared references.
- **Defensive Programming**: Introduced _Guard Clauses_ to validate emails, product availability, and ID integrity before processing any order.
- **Lean Architecture**: Removed redundant interfaces (such as `ICliente`) to reduce unnecessary complexity, maintaining abstraction only where necessary for polymorphism (`IProdotto`, `IProcessoProduzione`).
- **Centralized Controller**: Introduced the `GestoreOrdini` class as the _Single Source of Truth_ to coordinate orders and production.

---

## Project Architecture

The project is organized into three main layers to ensure separation of concerns and maintainability.

### 1. Abstractions (Interfaces)

I use interfaces to define the "contracts" of the system. This ensures that every component follows a strict structure, making the code easier to scale and test.

- **`IProdotto`**: The blueprint for all beachwear items.
- **`IProcessoProduzione`**: Defines how production lines should handle their internal lists.
- **`IEsitoOrdine`**: A standardized object for system feedback, containing success status and updated data.

### 2. Core Entities (Classes)

The concrete implementations that handle the specific behavior of the brand's assets.

- **Products (`ProdottoStandard`, `ProdottoPersonalizzato`)**: Use polymorphism to manage different swimwear types and pricing (e.g., surcharges for custom embroidery).
- **Customers (`Cliente`)**: Handle user data and trigger order requests with integrated payment method validation via `Enum`.

### 3. System Orchestrator (Management)

The "brain" of the application that coordinates the entire flow.

- **`GestoreOrdini`**: Acts as the **Single Source of Truth**. It performs data validation (email, availability), searches for the correct production lines, and updates the global state (always following the principle of immutability).

---

## How to Run

1.  **Prerequisites**: Ensure you have `Node.js` (you can download it from the [official Node.js website](https://nodejs.org/en/download)) and `TypeScript` installed:

```sh
npm install -g typescript
```

2.  **Clone** this repo:

```sh
git clone https://github.com/GabryAbdy/beachwear_project-TypeScript.git`
```

3.  **Execution**: You can run the test directly using:

```sh
tsc
node app.js
```

Still, the easiest way to run it is by visiting the project link on [CodePen](https://codepen.io/Gabriele-Abd-Alla-Awad/pen/dPMwroz).

---

## Test Case Example

The new system allows for end-to-end order tracking with detailed feedback:

```typescript
// Executing an immutable order through the customer instance
const ordineOk = cliente2.ordinaProdotto(costumeExtreme, gestoreOrdiniSunnee);

console.log("Esito ordine:", ordineOk);

// Checking the updated system state
gestoreOrdiniSunnee.getStatoSistema();
```
---

## License and Author

Distributed under the MIT License. See `LICENSE.txt` for more information.  
Gabriele Abd Alla Awad
