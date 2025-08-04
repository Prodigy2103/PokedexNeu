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
            <div class="viewSingleCard">
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
                        )}
                </div>

                <nav>
                    <p id="navInfo${index}" onclick="">Info</p>
                    <p id="navStats${index}" onclick="">Stats</p>
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
// renderStats(${index})
// renderInfo(${index})
// Next Step end the getSingleCardView
// load spinner 
// function zum wechseln der about und stats ansicht
// loadBtn zum laden neuer Pokemon