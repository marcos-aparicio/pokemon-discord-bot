const { api } = require("./api");

/*
 * Variable that will be used across the code to access pre-fetched values
 * from poke api for performance(don't have to call it everything)
 **/
const data = {
  pokemon: [],
  types: [],
};

/**
 * Calls the PokeAPI to retrieve all pokemons and types and fills it to the
 * data variable. This is done for performance so that we don't have to rely
 * on calling the api everything we need the pokemons and types, which are
 * essential resources on this discord bot. Retrieves the data in a format
 * supported by Discord Commands to be shown
 * @async
 **/
const preloadData = async () => {
  const pokemonSpeciesReq = await api.getAllPokemonSpecies();
  const pokemonReq = await api.getAllPokemon();
  const typesReq = await api.getAllTypes();

  const prePokemonSpeciesData = pokemonSpeciesReq.data.results.map((p) => ({
    name: p.name,
    value: p.name,
  }));
  const prePokemonData = pokemonReq.data.results.map((p) => ({
    name: p.name,
    value: p.name,
  }));

  data.pokemon = prePokemonData.filter((p) =>
    prePokemonSpeciesData.some((s) => s.name === p.name),
  );

  data.types = typesReq.data.results
    .map((t) => ({
      name: t.name,
      value: t.name,
    }))
    .filter((t) => t.value !== "stellar" && t.value !== "unknown");
};

module.exports = {
  data,
  preloadData,
};
