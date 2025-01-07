const { SlashCommandBuilder } = require("discord.js");
const {
  autocompletePokemon,
  validatePokemonName,
  getTextInEnglish,
  toCapitalCase,
  getPokemonSprite,
} = require("../helpers.js");
const { api } = require("../api.js");
const axios = require("axios");
const { EmbedBuilder } = require("@discordjs/builders");

// ===== Command Schema ==== //
const commandSchema = new SlashCommandBuilder()
  .setName("search-pokemon")
  .setDescription(
    "Searches for a Pokémon by name and returns basic information",
  )
  .addStringOption((option) =>
    option
      .setRequired(true)
      .setName("pokemon")
      .setDescription("Pokemon to search for")
      .setAutocomplete(true),
  );

// == Validation == //
/**
 * Returns true if validation is okay, false otherwise
 * so that the real execution can be skipped
 *
 * @async
 */
const validation = async (interaction) => {
  const pokemon = interaction.options.getString("pokemon");

  if (!(await validatePokemonName(pokemon))) {
    await interaction.reply(`The Pokémon ${pokemon} does not exist`);
    return false;
  }
  return true;
};

// === Command Execution === //
const execute = async (interaction) => {
  // == inputs == //
  const pokemon = interaction.options.getString("pokemon");

  // == requests == //
  const pokemonReq = await api.getPokemon(pokemon);
  const pokemonSpeciesReq = await axios.get(pokemonReq.data.species.url);

  // == data attributes == //
  const pokemonDesc = getTextInEnglish(
    pokemonSpeciesReq.data.flavor_text_entries,
  ).flavor_text.replace("\n", " ");
  const pokemonName =
    getTextInEnglish(pokemonSpeciesReq.data.names).name ??
    toCapitalCase(pokemonReq.data.name);
  const pokemonTypes = pokemonReq.data.types.map((type) =>
    toCapitalCase(type.type.name),
  );
  const pokemonGenus = getTextInEnglish(pokemonSpeciesReq.data.genera).genus;

  const pokemonDescEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(pokemonName)
    .addFields(
      {
        name: "Height",
        value: `${pokemonReq.data.height / 10} m`,
        inline: true,
      },
      {
        name: "Weight",
        value: `${pokemonReq.data.weight / 10} kg`,
        inline: true,
      },
      {
        name: "Types",
        value: pokemonTypes.join(", "),
        inline: true,
      },
      {
        name: "Description",
        value: pokemonDesc,
      },
    )
    .setImage(getPokemonSprite(pokemonReq.data.sprites))
    .setFooter({
      text: `#${pokemonReq.data.id} - ${pokemonGenus}`,
    });

  return await interaction.reply({ embeds: [pokemonDescEmbed] });
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
