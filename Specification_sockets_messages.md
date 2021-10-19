# Spécification des message socket

## Client -> serveur (test)

create_game -> Création d'une nouvelle partie
join_game -> Rejoindre une partie en cours

ask_move_up -> Demande d'un déplacement vers le haut
ask_move_down -> Demande d'un déplacement vers le bas
ask_move_right -> Demande d'un déplacement vers la droite
ask_move_left -> Demande d'un déplacement vers la gauche

## Serveur -> Client (JSON)

Envoi toujours l'état courant de la partie sous format JSON.
Il commence par initialiser la partie (Envoi d'un JSON à chaque client connecté).
Ensuite, il attends des messages de clients
Lorsqu'il reçoit un message d'un client, il met à jour son état interne.


## Exemple de format JSON
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
