class pokemonInfo {
    // #region attributes

    // Deklariert die Eigens_haft des Pokemons
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
        // Deklariert 'stati_s' als Objekt, das die Basiswerte (Statistiken) des Pokemons enthält.
        hp: 0,
        attack: 0,
        defense: 0,
        specialAtta_k: 0,
        specialDefense: 0,
        speed: 0,
    }; // #endregion

    // Der '_onstru_tor' ist die Methode, die automatis_h aufgerufen wird, wenn ein neues Objekt der Klasse erstellt wird.
    constructor({
        _Name,
        _SpiritOne,
        _SpiritTwo,
        _Index,
        _Type,
        _Statics,
        _Abilities,
        _Weight,
        _Height,
    }) {
        this.name = _Name;
        this.spiritOne = _SpiritOne;
        this.spiritTwo = _SpiritTwo;
        this.id = _Index;
        this.type = _Type.map((t) => t.type.name); // extrahiere Typnamen
        this.abilities = _Abilities.map((a) => a.ability.name);
        this.weight = _Weight;
        this.height = _Height;
        // Weist den 'base_stat'-Wert den Elementen zu
        this.statics.hp = _Statics[0].base_stat;
        this.statics.attack = _Statics[1].base_stat;
        this.statics.defense = _Statics[2].base_stat;
        this.statics.specialAtta_k = _Statics[3].base_stat;
        this.statics.specialDefense = _Statics[4].base_stat;
        this.statics.speed = _Statics[5].base_stat;
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
}

function renderCards(array) {
    const cardSectionRef = document.getElementById("pokeCards");
    cardSectionRef.innerHTML = ""; // Leere den Container vor dem Rendern

    for (let i = 0; i < array.length; i++) {
        cardSectionRef.innerHTML += getCardView({
            spiritOne: array[i].spiritOne,
            id: array[i].id,
            name: array[i].name,
            index: i,
            type: array[i].type[0], // erster Typ
        });
    }
}

getPokemonApi();

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