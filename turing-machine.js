let rulesetElement = document.querySelector("#ruleset");
let tape = document.querySelector("#tape");
const visualMT = document.querySelector("#visualMT");

let state = "";
let position = 0;
let rulesetOBJ = {};
let tapeArray = [];

function handleSubmit(event) {
    // Stop the form from reloading the page
    event.preventDefault();
    clear();

    // If there's no file, do nothing
    if (!rulesetElement.value.length) return;

    // Create a new FileReader() object
    let reader = new FileReader();

    // Setup the callback event to run when the file is read
    reader.onload = startMT;

    // Read the file
    reader.readAsText(rulesetElement.files[0]);
}

function startMT(event) {
    let str = event.target.result;
    rulesetOBJ = JSON.parse(str);

    console.log(rulesetOBJ);

    tapeArray = tape.value.split("");

    // Define o estado atual como o estado inicial da sétupla
    state = rulesetOBJ.EstadoInicial;

    while (stepLookup()) {
        if (rulesetOBJ.EstadosFinais.includes(state)) {
            printLine(getStatus());
            printLine("Aceita");
            return;
        }

        printLine(getStatus());
        step();
    }

    if (rulesetOBJ.EstadosFinais.length) {
        if (rulesetOBJ.EstadosFinais.includes(state)) {
            printLine(getStatus());
            printLine("Aceita");
        } else {
            printLine(getStatus());
            printLine("Rejeita");
        }
    } else {
        printLine(getStatus());
        printLine("halt");
    }

    printFinal(rulesetOBJ);
}

function printFinal(rulesetOBJ) {
    let div = document.createElement("div");

    console.log(Object.keys(rulesetOBJ.Transicoes));
    const transitions = rulesetOBJ.Transicoes;

    let transitionArray = [];

    Object.keys(transitions).forEach(function (keyState, index) {
        Object.keys(rulesetOBJ.Transicoes[keyState]).forEach(function (
            keySymbol,
            index
        ) {
            transitionArray.push(
                `(${keyState},${keySymbol}) = (${rulesetOBJ.Transicoes[
                    keyState
                ][keySymbol].join(",")})`
            );
        });
    });

    div.innerHTML = `
        Sétupla: <span>M = ({${rulesetOBJ.Estados.join(
            ","
        )}}, {${rulesetOBJ.Alfabeto.join(
        ","
    )}}, {${rulesetOBJ.AlfabetoFita.join(",")}},
    {${transitionArray.map((x) => {
        return x;
    })}},
    ${rulesetOBJ.EstadoInicial},{${rulesetOBJ.EstadosFinais.join(",")}})</span>
    </br>
    </br>
    Cadeia testada: <span>${tape.value}</span>`;
    visualMT.appendChild(div);
}

function stepLookup() {
    if (
        rulesetOBJ.Transicoes[state] &&
        rulesetOBJ.Transicoes[state][tapeArray[position]]
    ) {
        return rulesetOBJ.Transicoes[state][tapeArray[position]];
    } else {
        return false;
    }
}

function step() {
    let new_state = stepLookup()[0];
    let new_symbol = stepLookup()[1];
    let move = stepLookup()[2];
    writeSymbolTape(new_symbol);
    state = new_state;
    shiftHead(move);
}

function shiftHead(move) {
    if (position == 0 && move == "L") {
        extendLeft();
    } else if (position == tapeArray.length - 1 && move == "R") {
        extendRight();
        position += 1;
    } else if (move == "L") {
        position -= 1;
    } else {
        position += 1;
    }
}

// Informa estado, posição da cabeça atual e cadeia na fita em forma de string
function getStatus() {
    return (
        tapeArray.join(" ") +
        " || " +
        `Estado atual: ${state} | Posição da fita: ${position}`
    );
}

// Escreve um símbolo na posição "position" da fita
function writeSymbolTape(symbol) {
    tapeArray[position] = symbol;
}

// Adiciona branco no começo da fita
function extendLeft() {
    tapeArray.unshift("B");
}

// Adiciona branco no final da fita
function extendRight() {
    tapeArray.push("B");
}

function printLine(string) {
    let p = document.createElement("p");
    p.innerText = string;
    visualMT.appendChild(p);
}

function clear() {
    visualMT.innerHTML = "";

    state = "";
    position = 0;
    rulesetOBJ = {};
    tapeArray = [];
}

form = document.querySelector("form");
form.addEventListener("submit", handleSubmit);
