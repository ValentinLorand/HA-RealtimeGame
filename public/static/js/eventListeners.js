function setupKeydownHandler(socket, secret) {
    document.onkeydown = e => {
        console.log(e.key)
        switch (e.key) {
            case "ArrowRight":
                socket.send(`${secret} ask_move_right`)
                break;
            case "ArrowDown":
                socket.send(`${secret} ask_move_down`)
                break;
            case "ArrowLeft":
                socket.send(`${secret} ask_move_left`)
                break;
            case "ArrowUp":
                socket.send(`${secret} ask_move_up`)
                break;
        }
    }
}