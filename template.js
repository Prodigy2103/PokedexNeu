function getCardView({ spiritOne, id, name, index }) {
    return `
        <div class="card">
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

function getSingleCardView({ spiritOne, id, name, index, height, weight, types }) {
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
                        )
                        .join("")}
                </div>
            </div>
    `;
}