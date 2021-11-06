const svgns = "http://www.w3.org/2000/svg"
const container = document.getElementById( 'cont' );

function render(state) {
    
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
                let rect = document.createElementNS(svgns, 'rect')
                rect.setAttributeNS(null, 'x', (o.x + 0.5) * CELL_X_SPACING - PLAYER_SIZE/2 + BOARD_CELL_SIZE/2);
                rect.setAttributeNS(null, 'y', (o.y + 0.5) * CELL_Y_SPACING - PLAYER_SIZE/2 + BOARD_CELL_SIZE/2);
                rect.setAttributeNS(null, 'width', PLAYER_SIZE)
                rect.setAttributeNS(null, 'height', PLAYER_SIZE)
                rect.setAttributeNS(null, 'style', 'fill:rgb(0,0,200)')
                container.appendChild(rect);
                break;
            case "sweet":
                let circle = document.createElementNS(svgns, 'circle')
                circle.setAttributeNS(null, 'cx', (o.x + 0.5) * CELL_X_SPACING + BOARD_CELL_SIZE/2);
                circle.setAttributeNS(null, 'cy', (o.y + 0.5) * CELL_Y_SPACING + BOARD_CELL_SIZE/2);
                circle.setAttributeNS(null, 'r', SWEET_RADIUS)
                circle.setAttributeNS(null, 'style', 'fill:rgb(200,0,0)')
                container.appendChild(circle);
                break;
        }
    })

}

render({
    "game" : {
        "dimension_x" : 20,
        "dimension_y" : 20,
    },
    "objects" : [
        {
            "kind" : "player",
            "name" : "Joueur1",
            "x" : 0,
            "y" : 1,
            "counter_sweet" : 0,
        },
        {
            "kind" : "sweet",
            "x" : 5,
            "y" : 6,
        },
        {
            "kind" : "sweet",
            "x" : 8,
            "y" : 9,
        },
    ]
})