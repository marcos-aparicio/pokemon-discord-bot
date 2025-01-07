const { data, preloadData } = require("./data.js");

module.exports = {
  /**
   * Method utilized on autocompleting options in discord commands
   * of type string. Assumes that the only autocomplete options
   * on the discord command are the ones that need to fetch pokemons
   *
   * @async
   */
  autocompletePokemon: async (interaction) => {
    if (data.pokemon.length === 0) {
      await preloadData();
    }

    const pokemonToQuery = interaction.options.getFocused();

    const filtered = data.pokemon
      .filter((choice) =>
        choice.value.toLowerCase().includes(pokemonToQuery.toLowerCase()),
      )
      .slice(0, 25);

    await interaction.respond(filtered);
  },
  /**
   * Validates the pokemon name based on whether it is part of the
   * pokemon list or not
   *
   * @param {string} pokemon - The pokemon name to validate
   * @async
   */
  validatePokemonName: async (pokemon) => {
    if (data.pokemon.length === 0) {
      await preloadData();
    }
    return data.pokemon.some((choice) => choice.value === pokemon);
  },
  getTextInEnglish: (dict) => {
    return dict.find((entry) => entry.language.name === "en");
  },
  getTypeSprite: (name) => {
    const TYPE_SPRITES = {
      normal: "https://play.pokemonshowdown.com/sprites/types/Normal.png",
      fighting: "https://play.pokemonshowdown.com/sprites/types/Fighting.png",
      flying: "https://play.pokemonshowdown.com/sprites/types/Flying.png",
      poison: "https://play.pokemonshowdown.com/sprites/types/Poison.png",
      ground: "https://play.pokemonshowdown.com/sprites/types/Ground.png",
      rock: "https://play.pokemonshowdown.com/sprites/types/Rock.png",
      bug: "https://play.pokemonshowdown.com/sprites/types/Bug.png",
      ghost: "https://play.pokemonshowdown.com/sprites/types/Ghost.png",
      steel: "https://play.pokemonshowdown.com/sprites/types/Steel.png",
      fire: "https://play.pokemonshowdown.com/sprites/types/Fire.png",
      water: "https://play.pokemonshowdown.com/sprites/types/Water.png",
      grass: "https://play.pokemonshowdown.com/sprites/types/Grass.png",
      electric: "https://play.pokemonshowdown.com/sprites/types/Electric.png",
      psychic: "https://play.pokemonshowdown.com/sprites/types/Psychic.png",
      ice: "https://play.pokemonshowdown.com/sprites/types/Ice.png",
      dragon: "https://play.pokemonshowdown.com/sprites/types/Dragon.png",
      dark: "https://play.pokemonshowdown.com/sprites/types/Dark.png",
      fairy: "https://play.pokemonshowdown.com/sprites/types/Fairy.png",
    };
    const DEFAULT =
      "https://play.pokemonshowdown.com/sprites/types/%3f%3f%3f.png";

    return TYPE_SPRITES[name] || DEFAULT;
  },
  getPokemonSprite: (sprites) => {
    // pokemonReq.data.sprites.other.showdown.front_default
    // sprites object from pokemon api request response
    return (
      sprites.other["official-artwork"].front_default ??
      sprites.other.showdown.front_default ??
      sprites.front_default
    );
  },
  toCapitalCase: (str) => {
    return str.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  },
};
