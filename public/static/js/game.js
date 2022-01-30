const svgns = "http://www.w3.org/2000/svg"
const container = document.getElementById( 'cont' );
const scoreboard = document.getElementById( 'scoreboard' )


function render(state) {

    // Cleaning board
    container.innerHTML = ''
    scoreboard.innerHTML = ''
    
    const BOARD_CELL_SIZE = 5
    const CELL_X_SPACING = (container.clientWidth - 10) / state.game.dimension_x
    const CELL_Y_SPACING = (container.clientHeight - 10) / state.game.dimension_y
    const PLAYER_SIZE = 25
    const SWEET_RADIUS = 15

    // Render board
    for (let x = 0; x < state.game.dimension_x; x++) {
        for (let y = 0; y < state.game.dimension_y; y++) {
        let rect = document.createElementNS(svgns, 'rect')
        rect.setAttributeNS(null, 'x', (x + 0.5) * CELL_X_SPACING);
        rect.setAttributeNS(null, 'y', (y + 0.5) * CELL_Y_SPACING);
        rect.setAttributeNS(null, 'width', BOARD_CELL_SIZE)
        rect.setAttributeNS(null, 'height', BOARD_CELL_SIZE)
        rect.setAttributeNS(null, 'style', 'fill:rgb(200,200,200)')
        container.appendChild(rect);
        }
    }

    // Render objects
    state.objects.forEach(o => {
        switch (o.kind) {
            case "player":
                // Rect
                let rect = document.createElementNS(svgns, 'rect')
                rect.setAttributeNS(null, 'x', (o.x + 0.5) * CELL_X_SPACING - PLAYER_SIZE/2 + BOARD_CELL_SIZE/2);
                rect.setAttributeNS(null, 'y', (o.y + 0.5) * CELL_Y_SPACING - PLAYER_SIZE/2 + BOARD_CELL_SIZE/2);
                rect.setAttributeNS(null, 'width', PLAYER_SIZE)
                rect.setAttributeNS(null, 'height', PLAYER_SIZE)
                rect.setAttributeNS(null, 'style', 'fill:rgb(0,0,200)')
                container.appendChild(rect);
                // Name
                let text = document.createElementNS(svgns, 'text')
                text.setAttributeNS(null, 'x', (o.x + 0.5) * CELL_X_SPACING);
                text.setAttributeNS(null, 'y', (o.y + 0.5) * CELL_Y_SPACING - PLAYER_SIZE/2);
                text.setAttributeNS(null, 'text-anchor', 'middle');
                text.innerHTML = o.name
                container.appendChild(text);
                // Scoreboard
                let ul = document.createElement('tr')
                let liName = document.createElement('td')
                let liScore = document.createElement('td')
                liName.innerText = o.name
                liScore.innerText = o.counter_sweet
                ul.appendChild(liName)
                ul.appendChild(liScore)
                scoreboard.appendChild(ul)
                break;
            case "sweet":
                let circle = document.createElementNS(svgns, 'circle')
                circle.setAttributeNS(null, 'cx', (o.x + 0.5) * CELL_X_SPACING + BOARD_CELL_SIZE/2);
                circle.setAttributeNS(null, 'cy', (o.y + 0.5) * CELL_Y_SPACING + BOARD_CELL_SIZE/2);
                circle.setAttributeNS(null, 'r', SWEET_RADIUS)
                circle.setAttributeNS(null, 'style', 'fill:rgb(200,0,0)')
                container.appendChild(circle);
                break;
            default:
                break;
        }
    })
    
}

function getWinner(state) {
    return state["objects"].filter(o => o.kind == "player").sort((p1, p2) => p2["counter_sweet"] - p1["counter_sweet"])[0]["name"]
}