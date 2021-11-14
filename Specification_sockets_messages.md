# Spécification des message socket

## Client -> serveur (test)

- `join_game <nickname> <secret>`  -> Rejoindre une partie en cours
- `get_state <secret>` -> Demande de récupération de l'état courant de la partie
- `ask_move_up <secret>` -> Demande d'un déplacement vers le haut
- `ask_move_down <secret>` -> Demande d'un déplacement vers le bas
- `ask_move_right <secret>` -> Demande d'un déplacement vers la droite
- `ask_move_left <secret>` -> Demande d'un déplacement vers la gauche

## Serveur -> Client (JSON)

- `error <errorcode>` -> Une erreur est survenue<br>
    errorcodes :
    - `unknown_secret`
- `<gamestate as json>`

Si une erreur est survenue, le message commence par `error`. 
Dans tous les autres cas, envoie l'état courant de la partie sous format JSON.
Il commence par initialiser la partie (Envoi d'un JSON à chaque client connecté).
Ensuite, il attends des messages de clients
Lorsqu'il reçoit un message d'un client, il met à jour son état interne.


## Exemple de format JSON
State : 
```json
{
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
}
```
