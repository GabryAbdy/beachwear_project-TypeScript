# Sunnee Beachwear - Sustainable Management System (v2.0)

This TypeScript project simulates the management system for **Sunnee**, an eco-friendly beachwear brand. Version 2.0 represents a radical evolution from the initial prototype, adopting functional and defensive programming paradigms.

## Key Refactoring Improvements (What's New in v2.0)

Compared to the previous version, the code has been entirely rewritten to implement:

- **State Immutability**: Methods no longer modify existing objects. Instead, they return new updated instances. This ensures operation traceability and prevents bugs related to shared references.
- **Defensive & Fail-Fast Programming**: Introduced strict validation in constructors (e.g., Email and Enum checks) using `throw new Error`. This prevents the creation of invalid objects from the start.
- **Lean Architecture**: Removed redundant interfaces (such as `ICliente`) to reduce unnecessary complexity.
- **Centralized Controller**: Introduced the `GestoreOrdini` class as the _Single Source of Truth_ to coordinate orders and production.
- **[NEW] Actual Delegation**: The `GestoreOrdini` no longer contains "God logic". It coordinates the flow, but specific business rules (like availability checks or list updates) are delegated to `Prodotto` and `ProcessoProduzione`.
- **[NEW] Standardized Feedback Loop**: Implementation of a generic `IEsito<T>` interface to ensure consistent communication between all system layers (UI-ready).
- **[NEW] Modular architecture**: Code is split into specialized files (`Prodotto`, `Cliente`, `GestoreOrdini`, etc.) for better maintainability.

## Recent Improvements (v2.1)

Following code review feedback, the following refinements have been applied:

- **Import Consistency**: Systematic use of `import type` for type-only imports to improve tree-shaking and clarify compile-time vs runtime dependencies.
- **Email Validation**: Replaced basic `indexOf` check with regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` for robust email validation.
- **Product Comparison**: Implemented `sonoProdottiUguali()` helper function for explicit property-by-property comparison, replacing fragile `JSON.stringify()` approach.
- **DRY Principle**: Applied Template Method pattern to `assegnaProdotto`, moving shared validation logic to base class while delegating product-specific copy logic to subclasses.
- **Type Safety**: Removed redundant runtime enum validation, relying on TypeScript's compile-time type checking.

These changes improve code maintainability, performance, and demonstrate professional development practices.

---

## Project Architecture

The project is organized into three main layers to ensure separation of concerns and maintainability.

### 1. [NEW] Feedback Contract (Interface)

- **`IEsito<T>`**: A powerful generic interface used for every system response. It provides a `successo` flag, a `messaggio` for the user, and an optional `dati` payload of type `T`.

### 2. Core Entities (Classes)

The concrete implementations that handle the specific behavior of the brand's assets.

- **Products (`ProdottoStandard`, `ProdottoPersonalizzato`)**: Use polymorphism to manage different swimwear types. The `assegnaProdotto` method is now the source of truth for its own availability.
- **Customers (`Cliente`)**: Validates identity (Email) and payment methods upon instantiation. It acts as the trigger for the ordering process.
- **Production Lines (`ProcessoProduzione`)**: Manages a collection of immutable products, handling updates and new entries with collision detection (ID integrity).

### 3. System Orchestrator (Management)

The "brain" of the application that coordinates the entire flow.

- **`GestoreOrdini`**: Acts as the **Single Source of Truth**. It maps products to their respective production lines and orchestrates the immutable update of the entire system state.

---

## Technical Highlights

- **Generics**: Used in `IEsito<T>` to maintain type safety while handling different data payloads.
- **Method Overriding**: Specifically used in `Prodotto` subclasses to handle unique assignment logic.
- **Advanced Array Methods**: Extensive use of `.map()`, `.some()`, and `.find()` to maintain a declarative and immutable coding style.

---

## How to Run

1.  **Prerequisites**: Ensure you have `Node.js` installed on your machine (you can download it from the [official Node.js website](https://nodejs.org/en/download)).

2.  **Clone and Install** this repo:

```sh
git clone https://github.com/GabryAbdy/beachwear_project-TypeScript.git`
cd beachwear_project-Typescript
npm install
```

3.  **Run the Project**:

```sh
# Compile and run the simulation
npm start
```

This automatically compiles TypeScript and executes the code.

To compile only (without running):

```sh
npm run build
```

4. **Online Interactive Demo**: The easiest way to explore the modular architecture and see the system in action (including terminal logs) without any local setup is via **StackBlitz**:

> [!TIP]
> **[Open in StackBlitz](https://stackblitz.com/github/GabryAbdy/beachwear_project-TypeScript?file=src/main.ts)**

_Once the environment is loaded, you can run `npm start` in the integrated terminal to see the simulation output._

---

## Test Suite & Validation Scenarios

The project includes a robust test suite designed to verify the system's behavior across different operational contexts. Each test case demonstrates the reliability of our **Defensive Programming** and **Immutable State** approach.

### 🔍 Verified Scenarios:

1.  **Successful Order Flow**: Validates the complete cycle of a standard purchase, ensuring the product state transitions correctly from `Disponibile` to `Ordinato` and is assigned to the correct `Cliente`.
2.  **Inventory Constraints (Business Logic)**: Verifies that the system prevents orders for products marked as `Esaurito`, returning a clear `IEsito` message without altering the system state.
3.  **Fail-Fast Data Validation**: Uses `try...catch` blocks to confirm that the system correctly blocks the instantiation of `Cliente` objects with malformed email addresses or unsupported payment methods.
4.  **Production Line Integrity**: Tests the `aggiungiProdotto` logic to ensure no duplicate IDs can enter the production process, preventing data corruption and "typo" errors.
5.  **Global State Consistency**: A final verification step that checks if the `GestoreOrdini` (the Single Source of Truth) correctly reflects all previous operations in its global summary.

---

## Production Considerations

This project demonstrates best practices for a TypeScript portfolio application. In a production environment, additional considerations would include:

### Data Validation

Currently, all data is instantiated within TypeScript with compile-time type checking. For production use with external data sources (APIs, databases, user input), runtime validation would be essential:

- **Schema validation libraries** (Zod, Yup, Joi) for validating incoming data
- **Database constraints** and migrations
- **Input sanitization** for security

### Infrastructure & Scalability

- **Database integration** for persistent storage of products, customers, and orders
- **API layer** with proper error handling and logging
- **Authentication & Authorization** for multi-user scenarios
- **Observability** (structured logging, monitoring, tracing)

### Advanced Features

- **Event sourcing** to maintain complete order history
- **Inventory management** with real-time stock updates
- **Batch processing** for bulk operations
- **Caching strategies** for frequently accessed data

This project focuses on demonstrating clean architecture, immutability patterns, and type safety - the foundational principles that would support these production features.

## License and Author

Distributed under the MIT License. See `LICENSE.txt` for more information.  
Gabriele Abd Alla Awad
