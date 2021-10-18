# Spécification des message socket

## Client -> serveur (test)
    
Demandes de déplacement:
ask_move_up
ask_move_down
ask_move_right
ask_move_left

## Serveur -> Client (JSON)

Envoi toujours l'état courant de la partie sous format JSON.
Il commence par initialiser la partie (Envoi d'un JSON à chaque client connecté).
Ensuite, il attends des messages de clients
Lorsqu'il reçoit un message d'un client, il met à jour son état interne.


## Exemple de format JSON
```json
{
    "game" : [
        "dimension_x" : 20,
        "dimension_y" : 20,
    ],
    "objects" : [
        {
            "kind" : "player",
            "x" : 0,
            "y" : 1,
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
