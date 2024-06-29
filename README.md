# Pokeapi

A program written in javascript to make a request to the [pokeapi](https://pokeapi.co/) to the pokemon/id endpoint and display the results in the terminal with colors and download the official artwork sprite to `sprite.png` upon a succesfull request.

It takes a valid pokemon name as an argument and throws an error in any other case.

Uses the `https` module for making the request ***and*** downloading the image and the `fs` module for writing the response to `sprite.png`

Uses ansi color codes for rendering color on the terminal.

 Requires support for `16 colors` in the terminal and `node` (for executing)

## Usage
Clone the Repo and execute

    $ node main.js <pokemon-name>
