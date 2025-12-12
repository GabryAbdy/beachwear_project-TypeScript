
<!-- ABOUT THE PROJECT -->
## About The Project

This TypeScript project implements a simplified management system of a fictional brand, specialized in beachwear made of recycled plastic. It defines interfaces and classes to handle customer orders and track production processes.



### Link

This project has been deployed on [CodePen](https://codepen.io/Gabriele-Abd-Alla-Awad/pen/dPMwroz)



### Built With

* TypeScript


<!-- GETTING STARTED -->
## Getting Started

Since the source code is written in TypeScript, if you want to install this project on your device, the environment must be configured.


### Prerequisites

You must have the following installed:
1. **Node.js** and npm (**Node Package Manager**): The JavaScript runtime environment and package manager.
2. **TypeScript**



### Installation

If you do not have Node.js installed, download and install it from the [official Node.js website](https://nodejs.org/en/download).

Once Node.js is installed, you can install TypeScript globally via npm:

```sh
npm install -g typescript
```


### Clone the project

To clone the repository:

```sh
git clone https://github.com/GabryAbdy/beachwear_project-TypeScript.git
```



### How to Run the Project



#### - Option 1: Direct Execution via CodePen

The easiest way to view the code structure and see the tests in action is by visiting the CodePen link.

1. **Access the CodePen Link**:
> https://codepen.io/Gabriele-Abd-Alla-Awad/pen/dPMwroz
2. **View the Output**: all is run immediately upon loading. The results are visible in the **console panel** at the bottom of the CodePen interface.

#### - Option 2: Execution via Node.js

You can open the file `app.ts` in your IDE and just run the test directly in your terminal.

```sh
node app.ts
```
the results wil be displayed in the terminal.


<!-- CODE STRUCTURE -->
## Code Structure

The project has an Object-Oriented-Programming (OOP) approach.

### Interfaces

| Interface | Description | Methods |
| --- | --- | --- |
| `IProdotto` | Represents an item to be sold or produced. | `assegnaCliente(cliente: ICliente): void` |
| `ICliente` | Represents a user who can order products. | `ordinaProdotto(prodotto: IProdotto): void` |
| `IProcessoProduzione` | Groups a set of products into a process of production. | `aggiungiProdotto(prodotto: IProdotto): void` |

### Classes

The classes implements the simple business logic:
- `Prodotto`: implements `IProdotto` and manages the product status change with the order.
- `Cliente`: implements `ICliente` and contains the logic to check the availability of a product before purchase.
- `ProcessoProduzione`: implementes `IProcessoProduzione` and handles the addition of products checking their IDs avouding duplicates.


<!-- TEST EXAMPLE -->
## Test Example

A few instances show the interactions between customers, products and their production processes. Here is an example:

```typescript
// Test available product
console.log(costumeDaBagno1.stato); // pre-order status: disponibile

cliente1.ordinaProdotto(costumeDaBagno1); // Output: "Ordine riuscito! Marco Rossi ha acquistato: costume da bagno (ID: 1)."

console.log(costumeDaBagno1.stato); // post-order status: ordinato
```


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.


<!-- AUTHOR -->
## Author

Gabriele Abd Alla Awad
