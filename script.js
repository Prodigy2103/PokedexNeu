class pokemonInfo {
    name;
    spiritOne;
    spiritTwo;
    id;
    weight;
    height;
    arrayIndex;
    type = [];
    abilities = [];

    stats = {
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
    };

    constructor({
        _Name,
        _SpiritOne,
        _Index,
        _Type,
        _Abilities,
        _Weight,
        _Height,
        _Statics,
    }) {
        this.name = _Name;
        this.spiritOne = _SpiritOne;
        this.id = _Index;
        this.type = _Type.map((t) => t.type.name);
        this.abilities = _Abilities.map((a) => a.ability.name);
        this.weight = _Weight;
        this.height = _Height;
        this.statics = _Statics;
    }
}

const pokemonArray = [];
let currentPokemonOffset = 0;
let currentViewIndex = 0;
let currentCardArray = []; // ← aktives Array merken (normal oder Suche)

// #region async function
async function getPokemonApi() {
    showLoader();

    const limit = 30;

    for (
        let i = currentPokemonOffset + 1;
        i <= currentPokemonOffset + limit;
        i++
    ) {
        const pokemonResponse = await fetch(
            "https://pokeapi.co/api/v2/pokemon/" + i
        );
        const pokemonJson = await pokemonResponse.json();

        pokemonArray.push(
            new pokemonInfo({
                _Abilities: pokemonJson.abilities,
                _Name: pokemonJson.name,
                _Height: pokemonJson.height,
                _Weight: pokemonJson.weight,
                _Index: pokemonJson.id,
                _SpiritOne: pokemonJson.sprites.front_default,
                _SpiritTwo:
                    pokemonJson.sprites.other?.["official-artwork"]
                        ?.front_default || null,
                _Type: pokemonJson.types,
                _Statics: pokemonJson.stats,
            })
        );
    }

    currentPokemonOffset += limit;
    renderCards(pokemonArray);
    renderSingleViewCard(
        pokemonArray[currentViewIndex],
        currentViewIndex,
        pokemonArray
    );

    closeLoader();
}
// #endregion

// #region renderCards
function renderCards(array) {
    currentCardArray = array; // ← aktives Array setzen
    const cardSectionRef = document.getElementById("pokeCards");
    cardSectionRef.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        cardSectionRef.innerHTML += getCardView({
            spiritOne: array[i].spiritOne,
            id: array[i].id,
            name: array[i].name,
            index: i,
        });

        renderTypes(i, array);
    }
}

function renderTypes(index, array) {
    const typeRef = document.getElementById("types" + index);
    if (!typeRef) return;
    typeRef.innerHTML = "";

    for (let i = 0; i < array[index].type.length; i++) {
        typeRef.innerHTML += getTypeInfo(array[index].type[i]);
    }
}
// #endregion

// #region searchBar
// function search() {
//     const inputRef = document.getElementById("searchBar");
//     const inputValue = inputRef.value.trim().toLowerCase();

//     if (inputValue === "") {
//         // Bei leerem Suchfeld alle Pokémon anzeigen
//         renderCards(pokemonArray);
//         document.getElementById("singleCard").innerHTML = ""; // Single Card leeren
//         return;
//     }

//     if (inputValue.length < 3) {
//         // Weniger als 3 Zeichen -> nichts ändern
//         return;
//     }

//     // Filter basierend auf dem Input
//     const result = pokemonArray.filter(pokemon =>
//         pokemon.name.toLowerCase().includes(inputValue)
//     );

//     renderCards(result);
// }

function search() {
    const inputRef = document.getElementById('searchBar');
    const inputValue = inputRef.value.toLowerCase();

    if (inputValue.length >= 3) {
        const result = pokemonArray.filter(pokemon => pokemon.name.toLowerCase().includes(inputValue))

        renderCards(result);
    } if (inputValue == "") {
        renderCards(pokemonArray);
    }
}
// #endregion

// #region singleViewCrad
function renderSingleViewCard(pokemon, index, array = pokemonArray) {
    const viewCardRef = document.getElementById("singleCard");
    viewCardRef.innerHTML = "";

    viewCardRef.innerHTML = getSingleCardView({
        spiritOne: pokemon.spiritOne,
        id: pokemon.id,
        name: pokemon.name,
        index: index,
        abilities: pokemon.abilities,
        types: pokemon.type,
        height: pokemon.height,
        weight: pokemon.weight,
        statics: pokemon.statics,
    });

    renderTypes(index, array);
}
// #endregion

// #region for and backward button
function forward() {
    currentViewIndex++;
    if (currentViewIndex >= currentCardArray.length) {
        currentViewIndex = 0;
    }
    renderSingleViewCard(
        currentCardArray[currentViewIndex],
        currentViewIndex,
        currentCardArray
    );
}

function backward() {
    currentViewIndex =
        currentViewIndex > 0
            ? currentViewIndex - 1
            : currentCardArray.length - 1;
    renderSingleViewCard(
        currentCardArray[currentViewIndex],
        currentViewIndex,
        currentCardArray
    );
}
// #endregion

// #region show and close cardView
function showCardView(index) {
    const CardViewRef = document.getElementById("singleCard");
    CardViewRef.classList.add("d-flex");
    document.body.classList.add("no-scroll");

    currentViewIndex = index;
    renderSingleViewCard(currentCardArray[index], index, currentCardArray);
}

function closeViewCard() {
    const CardViewRef = document.getElementById("singleCard");
    CardViewRef.classList.remove("d-flex");
    document.body.classList.remove("no-scroll");
}
// #endregion

// #region render Info and Stats
function renderStats(index) {
    const contentDescRef = document.getElementById("desc" + index);
    const stats = pokemonArray[index].statics; // Speichert das statics-Array des Pokémon an der Position index in der Variable stats.

    contentDescRef.innerHTML = getStats({
        // Setzt den HTML-Inhalt eines Elements (vermutlich eine Beschreibung) mit dem von der Funktion
        index: index, // Übergibt den aktuellen Index des Pokémon an die getStats()-Funktion.
        hp: stats[0].base_stat, // Übergibt den Basiswert für HP (Lebenspunkte), der sich im ersten Element des globalen stats-Arrays befindet. Gilt auch für folgende Codezeilen
        attack: stats[1].base_stat,
        defense: stats[2].base_stat,
        specialAttack: stats[3].base_stat,
        specialDefense: stats[4].base_stat,
        speed: stats[5].base_stat,
    });
}

function renderInfo(index) {
    const contentDescRef = document.getElementById("desc" + index);

    contentDescRef.innerHTML = getInfo({
        height: pokemonArray[index].height,
        index: index,
        weight: pokemonArray[index].weight,
        abilities: pokemonArray[index].abilities,
    });
}
// #endregion

// #region loader show and close
function showLoader() {
    const loader = document.getElementById("loader"); // Sucht im HTML-Dokument nach einem Element mit der ID loader und speichert es in der Variablen loader.
    if (loader) {
        // Prüft, ob das Element mit der ID loader existiert (also nicht null ist).
        loader.classList.remove("hidden"); // Entfernt die CSS-Klasse "hidden" vom loader-Element, wodurch das Element sichtbar wird (angenommen, .hidden versteckt das Element).
    }
}

function closeLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("hidden"); // Fügt die CSS-Klasse "hidden" zum loader-Element hinzu, wodurch es ausgeblendet wird.
    }
}
// #endregion

getPokemonApi();

function funktionsName() {}

function funktionsName2(a, b) {}

function funktionsName2() {
    return;
}

function funktionsName2(a, b, z) {
    return;
}

// Erklärung zur Änderung der showCardView function stehen im Lerntagebuch

// function 3 par a b c a +b *c return

// funktion mit return wird wie wert behandelt
// function test(a, b, c) {
//     return (a + b) * c;
// }

// console.log(test(2, 3, 5));

// function testTwo() {
//     console.log((2 + 3) * 5);
// }

// testTwo();

// function test3(a, b, c) {
//     console.log((a + b) * c);
// }

// test3(2, 3, 5);

// function test4() {
//     return (2 + 3) * 5;
// }

// console.log(test4());

// 1. funktion welche via for-loop die zahlen 1-5 durchläuft und diese dann in der console ausgeben
// 1
// 2
// 3
// 4
// 5

function testLoop() {
    for (let i = 1; i <= 5; i++) {
        console.log(i);
    }
}
testLoop();

function testTwoLoop(a, b, c, d, e) {
    const numbers = [a, b, c, d, e];

    for (let i = 0; i < numbers.length; i++) {
        console.log(numbers[i]);
    }
}

testTwoLoop(1, 2, 3, 4, 5);

function test3Loop() {
    let output = "";

    for (let i = 1; i <= 5; i++) {
        console.log(i);
    }

    return output;
}

console.log(test3Loop());

function test4Loop(start, end) {
    let output = "";

    for (let i = start; i <= end; i++) {
        console.log(i);
    }

    return output;
}

console.log(test4Loop(1, 5));

// 2. funktion für die flächenberechnung eines quadrats

function test(a) {
    return a * a;
}

console.log(test(6));

function testTwo() {
    console.log(6 * 6);
}

testTwo();

function test3(a) {
    console.log(a * a);
}

test3(6);

function test4() {
    return 6 * 6;
}

console.log(test4());

// funktion zum berechen der Fläche eines Würfels
function testDice() {
    console.log(2.5 * 2.5 * 2.5);
}

testDice();

function testDice2(a) {
    console.log(a * a * a);
}

testDice(2.5);

function testDice3() {
    return 2.5 * 2.5 * 2.5;
}

console.log(testDice3());

function testDice4(a) {
    return a * a * a;
}

console.log(testDice4(2.5));

// funktion um Prozente zu berechen
function testPercent() {
    console.log((25 * 100) / 75);
}

testPercent();

function testPercentTwo(a, b, c) {
    console.log((a * b) / c);
}

testPercentTwo(25, 100, 85);

function testDiceThree() {
    return (25 * 100) / 100;
}

console.log(testDiceThree());

function testDiceFour(a, b, c) {
    return (a * b) / c;
}

console.log(testDiceFour(25, 100, 20));
