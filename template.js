function getCardView({ spiritOne, id, name, index, type }) {
    return /*html*/ ` 
        <div class="card" onclick="">
            <img src="${spiritOne}" alt="${name}">
            <div class="cardInfos">
                <p># ${id}</p>
                <p class="cardName ${type}">${name}</p>
                <div id="type${index}" class="typeForm"></div>
            </div>
        </div>
    `;
}