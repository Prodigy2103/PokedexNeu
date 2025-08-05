class pokemonInfo {
    // #region attributes

    // Deklariert die Eigenschaft des Pokemons
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
        // Deklariert 'statics' als Objekt, das die Basiswerte (Statistiken) des Pokemons enthält.
        hp: 0,
        attack: 0,
        defense: 0,
        specialAttack: 0,
        specialDefense: 0,
        speed: 0,
    }; // #endregion

    // Der 'constructor' ist die Methode, die automatisch aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird.
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
        // console.log("Stat-Werte:", _Statics);
        this.name = _Name;
        this.spiritOne = _SpiritOne;
        this.id = _Index;
        this.type = _Type.map((t) => t.type.name); // Die map()-Funktion geht jedes Element im Array _Type durch. Für jedes Element t wird t.type.name extrahiert – also der name-Wert aus dem type-Objekt.
        this.abilities = _Abilities.map((a) => a.ability.name); // Extrahiert die Namen aller Fähigkeiten aus dem Array _Abilities. map-Funktion: Wandelt jedes Element in _Abilities um. a.ability.name: Greift auf den Namen der Fähigkeit zu. Ein neues Array mit nur den Fähigkeitsnamen wird this.abilities zugewiesen.
        this.weight = _Weight;
        this.height = _Height;
        this.statics = _Statics;
    }
}

const pokemonArray = [];
let currentPokemonOffset = 0;
let currentViewIndex = 0;

// async function getPokemonApi() {
//     const limit = 30;

//     for (
//         let i = currentPokemonOffset + 1;
//         i <= currentPokemonOffset + limit;
//         i++
//     ) {
//         const pokemonResponse = await fetch(
//             "https://pokeapi.co/api/v2/pokemon/" + i
//         );
//         const pokemonJson = await pokemonResponse.json();

//         pokemonArray.push(
//             new pokemonInfo({
//                 _Abilities: pokemonJson.abilities,
//                 _Name: pokemonJson.name,
//                 _Height: pokemonJson.height,
//                 _Weight: pokemonJson.weight,
//                 _Index: pokemonJson.id,
//                 _SpiritOne: pokemonJson.sprites.front_default,
//                 _SpiritTwo:
//                     pokemonJson.sprites.other?.["official-artwork"]
//                         ?.front_default || null,
//                 _Type: pokemonJson.types,
//                 _Statics: pokemonJson.stats,
//             })
//         );
//     }

//     currentPokemonOffset += limit;
//     renderCards(pokemonArray);
//     renderSingleViewCard(pokemonArray[currentViewIndex], currentViewIndex);
// }

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
    renderSingleViewCard(pokemonArray[currentViewIndex], currentViewIndex);

    closeLoader();
}

function renderCards(array) {
    const cardSectionRef = document.getElementById("pokeCards");
    cardSectionRef.innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        cardSectionRef.innerHTML += getCardView({
            spiritOne: array[i].spiritOne,
            id: array[i].id,
            name: array[i].name,
            index: i,
        });

        // Jetzt die Typen für jede Karte einfügen
        renderTypes(i, array);
    }
}

function renderTypes(index, array) {
    const typeRef = document.getElementById("types" + index);
    if (!typeRef) return; // Wenn typeRef nicht gefunden wurde (also null oder undefined ist), bricht die Funktion ab und macht nichts weiter. Das verhindert Fehler, falls das Element nicht existiert.
    typeRef.innerHTML = "";

    for (let i = 0; i < array[index].type.length; i++) {
        typeRef.innerHTML += getTypeInfo(array[index].type[i]); // getTypeInfo(array[index].type[i]) wird aufgerufen und bekommt als Argument den jeweiligen Typ, z.B. "fire". Das Ergebnis dieser Funktion (vermutlich ein HTML-String) wird an den aktuellen Inhalt von typeRef.innerHTML angehängt (+= heißt "hinzufügen").
    }
}

function toggleButton() {
    const input = document.getElementById("searchBar").value;
    const button = document.getElementById("searchButton");
    button.disabled = input.length < 3;
}

function search() {
    const inputRef = document.getElementById("searchBar");
    const inputValue = inputRef.value.toLowerCase();

    const result = pokemonArray.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputValue)
    );

    if (inputValue === "") {
        renderCards(pokemonArray); // Zeige alle
    } else {
        renderCards(result); // Zeige Suchergebnisse
    }
}
// #endregion

function renderSingleViewCard(pokemon, index) {
    const viewCardRef = document.getElementById("singleCard");
    viewCardRef.innerHTML = ""; // Container leeren

    viewCardRef.innerHTML = getSingleCardView({
        spiritOne: pokemon.spiritOne,
        id: pokemon.id,
        name: pokemon.name,
        index: currentViewIndex,
        abilities: pokemon.abilities,
        types: pokemon.type,
        height: pokemon.height,
        weight: pokemon.weight,
        statics: pokemon.statics,
    });

    renderTypes(index, pokemonArray);
}

function backward() {
    currentViewIndex =
        currentViewIndex > 0 ? currentViewIndex - 1 : pokemonArray.length - 1; // Wenn currentViewIndex größer als 0 ist, wird 1 abgezogen (zurück zur vorherigen Karte). Wenn currentViewIndex 0 ist, wird zum letzten Index des Arrays (pokemonArray.length - 1) gesprungen (Zirkularität).
    renderSingleViewCard(pokemonArray[currentViewIndex], currentViewIndex); // Zeigt die Karte an, die jetzt durch currentViewIndex bestimmt wird.
}

function forward() {
    currentViewIndex = currentViewIndex + 1; // Erhöht den currentViewIndex um 1 (nächste Karte).

    if (currentViewIndex >= pokemonArray.length) {
        // Prüft, ob der Index über das Array hinausgeht.
        currentViewIndex = 0; // Wenn ja, wird der Index wieder auf 0 gesetzt (Zirkularität).
    }

    renderSingleViewCard(pokemonArray[currentViewIndex], currentViewIndex); // Zeigt die Karte an, die durch den neuen Index bestimmt wird.
}

function showCardView(index) {
    const CardViewRef = document.getElementById("singleCard"); // Holt das DOM-Element mit der ID singleCard.
    CardViewRef.classList.add("d-flex"); // Fügt die CSS-Klasse d-flex hinzu, damit die Karte sichtbar und als flex-container angezeigt wird.
    document.body.classList.add("no-scroll"); // Verhindert das Scrollen der Seite (Body overflow hidden).

    currentViewIndex = index; // 👉 Damit Vor/Zurück auch funktioniert
    renderSingleViewCard(pokemonArray[index]); // Setzt currentViewIndex auf den angeklickten Index (damit Vor- und Zurück-Buttons korrekt arbeiten).
}

function closeViewCard() {
    const CardViewRef = document.getElementById("singleCard"); // Holt wieder das singleCard-Element.
    CardViewRef.classList.remove("d-flex"); // Entfernt die Sichtbarkeitsklasse, sodass die Ansicht ausgeblendet wird.
    document.body.classList.remove("no-scroll"); // Erlaubt wieder das Scrollen der Seite.
}

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

function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.remove("hidden");
    }
}

function closeLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        loader.classList.add("hidden");
    }
}

getPokemonApi();

// Erklärung zur Änderung der showCardView function stehen im Lerntagebuch
