function getCardView({ spiritOne, id, name, index, type }) {
    return /*html*/ ` 
        <div class="card" onclick="">
            <img src="${spiritOne}" alt="${name}">
            <div class="cardInfos">
                <p># ${id}</p>
                <p class="cardName ${type}">${name}</p>
                <div id="type" class="typeForm">${type}</div>
            </div>
        </div>
    `;
}

// Next step template singleCardView