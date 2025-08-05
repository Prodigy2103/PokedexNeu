function getCardView({ spiritOne, id, name, index }) {
    return `
        <div class="card" onclick="showCardView(${index})">
            <img src="${spiritOne}" alt="${name}" /><br>
            <p>#${id}</p>
            <h2> ${name}</h2>
            <div id="types${index}" class="typesContainer"></div>
        </div>
    `;
}

function getTypeInfo(type){
    return `<span class="type ${type}">${type}</span>`
}

// Next step template singleCardView

function getSingleCardView({ spiritOne, id, name, index, height, weight, types}) {
    return `
            <div class="viewSingleCard" onclick="event.stopPropagation()">
            <img src="${spiritOne}" alt="${name}">
                <div class="headLine ${types}">
                    <p>#${id}</p>
                    <h2>${name}</h2>
                </div>
                
                
                <div class="typesInfo" id="types${index}">
                    ${types
                        .map(
                            (type) =>
                                `<span class="type ${type}">${type}</span>`
                        ).join("")}
                </div>

                <nav>
                    <p id="navInfo${index}" class="highlight" onclick="renderInfo(${index})">Info</p>
                    <p id="navStats${index}" class="highlight" onclick="renderStats(${index})">Stats</p>
                </nav>

                <div id="desc${index}" class="contentDesc">
                    <table>
                        <tbody>
                            <tr>
                                <td>Height:</td>
                                <td class="flex-space">${height}</td>
                            </tr>
                            <tr>
                                <td>Weight:</td>
                                <td class="flex-space">${weight}</td>
                            </tr>
                            <tr>
                                <td>Abilities:</td>
                                <td class="flex-space">${types}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="btnSingleCardview">
                <button onclick="backward()">back</button>
                <button onclick="forward()">next</button>
            </div>
            </div>
    `;
}

// function zum wechseln der about und stats ansicht done

function getInfo({height, weight, abilities, index}){
    return /*html*/`
                <div id="desc${index}" class="contentDesc">
                    <table>
                        <tbody>
                            <tr>
                                <td>Height:</td>
                                <td class="flex-space">${height}</td>
                            </tr>
                            <tr>
                                <td>Weight:</td>
                                <td class="flex-space">${weight}</td>
                            </tr>
                            <tr>
                                <td>Abilities:</td>
                                <td class="flex-space">${abilities}</td>
                            </tr>
                        </tbody>
                    </table>
                    `
}

function getStats({index, hp, attack, defense, specialAttack, specialDefense, speed}){
    
    return /*html*/`
    <div id="desc${index}" class="contentDesc">
        <table>
            <tr>
                <td>hp:</td>
                <td>${hp}</td>
            </tr>
            <tr>
                <td>attack:</td>
                <td>${attack}</td>
            </tr>
            <tr>
                <td>defense:</td>
                <td>${defense}</td>
            </tr>
            <tr>
                <td>sp. attack:</td>
                <td>${specialAttack}</td>
            </tr>
            <tr>
                <td>sp. defense:</td>
                <td>${specialDefense}</td>
            </tr>
            <tr>
                <td>speed:</td>
                <td>${speed}</td>
            </tr>
        </table>
</div>
    `
}

// NEXTSTEPS
// load spinner 
// loadBtn zum laden neuer Pokemon