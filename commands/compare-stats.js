const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const {
  autocompletePokemon,
  validatePokemonName,
  getTextInEnglish,
  toCapitalCase,
  getPokemonSprite,
} = require("../helpers.js");
const axios = require("axios");
const { api } = require("../api.js");

// ===== Command Schema ==== //
const commandSchema = new SlashCommandBuilder()
  .setName("compare-stats")
  .setDescription("Compares the base stats of two Pokémon")
  .addStringOption((option) =>
    option
      .setName("pokemon1")
      .setDescription("The name of the first Pokémon (e.g., Pikachu).")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("pokemon2")
      .setDescription("The name of the second Pokémon (e.g., Charmander).")
      .setRequired(true)
      .setAutocomplete(true),
  );

// == Validation == //
const validation = async (interaction) => {
  const pokemon1 = interaction.options.getString("pokemon1");
  const pokemon2 = interaction.options.getString("pokemon2");

  if (!(await validatePokemonName(pokemon1))) {
    await interaction.reply(`The Pokémon ${pokemon1} does not exist`);
    return false;
  }

  if (!(await validatePokemonName(pokemon2))) {
    await interaction.reply(`The Pokémon ${pokemon2} does not exist`);
    return false;
  }

  return true;
};

// === Command Execution === //
const execute = async (interaction) => {
  const pokemon1 = interaction.options.getString("pokemon1");
  const pokemon2 = interaction.options.getString("pokemon2");
  const pokemons = [pokemon1, pokemon2];

  const outputEmbeds = await Promise.all(
    pokemons.map(async (pokemon) => {
      return await getEmbedStatsForPokemon(pokemon);
    }),
  );

  await interaction.reply({ embeds: outputEmbeds });
};

// === Helper Functions === //

/**
 * Creates an Embed Builder with a Pokémon's base stats
 *
 * @param {string} pokemon - The name of the Pokémon(should be available in the PokéAPI)
 * @async
 */
const getEmbedStatsForPokemon = async (pokemon) => {
  // == requests == //
  const pokemonReq = await api.getPokemon(pokemon);
  const pokemonSpeciesReq = await axios.get(pokemonReq.data.species.url);

  // == data attributes == //
  const pokemonName = getTextInEnglish(pokemonSpeciesReq.data.names).name;
  const pokemonTypes = pokemonReq.data.types.map((type) =>
    toCapitalCase(type.type.name),
  );
  const statFields = [];
  for (const stat of pokemonReq.data.stats) {
    statFields.push({
      name: toCapitalCase(stat.stat.name),
      value: `${stat.base_stat}`,
      inline: true,
    });
  }

  return new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(pokemonName)
    .addFields(...statFields, {
      name: "Types",
      value: pokemonTypes.join(", "),
      inline: true,
    })
    .setImage(getPokemonSprite(pokemonReq.data.sprites));
};

// === Exports === //
module.exports = {
  data: commandSchema,
  autocomplete: autocompletePokemon,
  execute: async (interaction) => {
    if (!(await validation(interaction))) return;

    await execute(interaction);
  },
};
