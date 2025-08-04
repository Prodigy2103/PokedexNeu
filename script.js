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

    statics = {
        // Deklariert 'statics' als Objekt, das die Basiswerte (Statistiken) des Pokemons enthält.
        hp: 0,
        attack: 0,
        defense: 0,
        specialAtta_k: 0,
        specialDefense: 0,
        speed: 0,
    }; // #endregion

    // Der 'constructor' ist die Methode, die automatisch aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird.
    constructor({
        _Name,
        _SpiritOne,
        _Index,
        _Type,
        _Statics,
        _Abilities,
        _Weight,
        _Height,
    }) {
        this.name = _Name;
        this.spiritOne = _SpiritOne;
        this.id = _Index;
        this.type = _Type.map((t) => t.type.name); // Die map()-Funktion geht jedes Element im Array _Type durch. Für jedes Element t wird t.type.name extrahiert – also der name-Wert aus dem type-Objekt.
        this.weight = _Weight;
        this.height = _Height;
    }
}

const pokemonArray = [];
let currentPokemonOffset = 0;
let currentViewIndex = 0;

async function getPokemonApi() {
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
    renderSingleViewCard(pokemonArray[currentViewIndex]);
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
    if (!typeRef) return;

    for (let i = 0; i < array[index].type.length; i++) {
        typeRef.innerHTML += getTypeInfo(array[index].type[i]);
    }
}

function search() {
    const inputRef = document.getElementById("searchBar");
    const inputValue = inputRef.value.toLowerCase(); // Den Input-Wert direkt in Kleinbuchstaben umwandeln

    // Filtert das pokemonArray basierend auf dem Namen.
    // wandeln auch den Pokemon-Namen in Kleinbuchstaben um, um einen
    // um den Vergleich zu gewährleisten.
    const result = pokemonArray.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(inputValue)
    );

    // Überprüfe die Länge des eingegebenen Suchbegriffs
    if (inputValue.length >= 3) {
        // Wenn der Suchbegriff 3 oder mehr Zeichen hat, zeige die gefilterten Ergebnisse an.
        renderCards(result); // Rufe deine vorhandene renderCards-Funktion auf
    } else if (inputValue === "") {
        // Wenn das Suchfeld leer ist, zeige wieder alle Pokemon an.
        renderCards(pokemonArray); // Zeige alle ursprünglichen Pokemon an
    }
    // Wenn der Input weniger als 3 Zeichen lang und nicht leer ist,
    // wird der aktuelle Zustand der Karten beibehalten, bis mehr eingegeben wird.
}
// #endregion

function renderSingleViewCard(pokemon) {
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

    renderTypes(currentViewIndex, pokemonArray);
}

function backward() {
    currentViewIndex = currentViewIndex > 0 ? currentViewIndex - 1 : pokemonArray.length - 1;
    renderSingleViewCard(pokemonArray[currentViewIndex]);
}

function forward() {
    currentViewIndex = (currentViewIndex + 1) % pokemonArray.length;
    renderSingleViewCard(pokemonArray[currentViewIndex]);
}

function showCardView(pokemonArray) {
    const CardViewRef = document.getElementById('singleCard');
    CardViewRef.classList.add('d-flex');
    document.body.classList.add('no-scroll');

    renderCards(pokemonArray);
}

// function closeCardView() {
//     const CardViewRef = document.getElementById('singleCard');
//     CardViewRef.classList.remove('d-flex');
//     document.body.classList.remove('no-scroll');
// }

getPokemonApi();
