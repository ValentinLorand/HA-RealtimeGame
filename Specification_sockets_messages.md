# Spécification des message socket

## Client -> serveur (test)

- `<secret> join_game <username>`  -> Rejoindre une partie en cours
- `<secret> get_state` -> Demande de récupération de l'état courant de la partie
- `<secret> ask_move_up` -> Demande d'un déplacement vers le haut
- `<secret> ask_move_down` -> Demande d'un déplacement vers le bas
- `<secret> ask_move_right` -> Demande d'un déplacement vers la droite
- `<secret> ask_move_left` -> Demande d'un déplacement vers la gauche

## Serveur -> Client (JSON)

- `error <errorcode>` -> Une erreur est survenue<br>
    errorcodes :
    - `unknown_message`
    - `unknown_secret`
- `<gamestate as json>`

Si une erreur est survenue, le message commence par `error`. 
Dans tous les autres cas, envoie l'état courant de la partie sous format JSON.
Il commence par initialiser la partie (Envoi d'un JSON à chaque client connecté).
Ensuite, il attends des messages de clients
Lorsqu'il reçoit un message d'un client, il met à jour son état interne.


## Exemple de première réponse
```json
{
"socket_servers" : [
        "127.0.0.1:8080",
        "127.0.0.1:8081",
        "127.0.0.1:8082"
    ]
}
```

## Exemple de format JSON
State : 
```json
{
    "game" : {
        "dimension_x" : 20,
        "dimension_y" : 20,
    },
    "socket_servers" : [
        "127.0.0.1:8080",
        "127.0.0.1:8081",
        "127.0.0.1:8082"
    ],
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
}
```
