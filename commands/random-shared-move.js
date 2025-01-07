const { SlashCommandBuilder } = require("discord.js");
const {
  autocompletePokemon,
  validatePokemonName,
  getTextInEnglish,
  getTypeSprite,
  toCapitalCase,
} = require("../helpers.js");
const { api } = require("../api.js");
const axios = require("axios");
const { EmbedBuilder } = require("@discordjs/builders");
const { data } = require("../data.js");

// === Global Variable === //
let moves = []; //basically to "cache" the moves so that we don't have to use the API everytime the user types

// ===== Command Schema ==== //
const commandSchema = new SlashCommandBuilder()
  .setName("random-shared-move")
  .setDescription(
    "Selects and displays a random move that both of the pokemon especified can learn",
  )
  .addStringOption((option) =>
    option
      .setName("pokemon1")
      .setDescription("The name of the first Pokémon (e.g., Bulbasaur).")
      .setRequired(true)
      .setAutocomplete(true),
  )
  .addStringOption((option) =>
    option
      .setName("pokemon2")
      .setDescription("The name of the second Pokémon (e.g., Bulbasaur).")
      .setRequired(true)
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
  // == inputs == //
  const pokemon1 = interaction.options.getString("pokemon1");
  const pokemon2 = interaction.options.getString("pokemon2");

  // == requests == //
  const pokemon1Req = await api.getPokemon(pokemon1);
  const pokemon1SpeciesReq = await axios.get(pokemon1Req.data.species.url);
  const pokemon2Req = await api.getPokemon(pokemon2);
  const pokemon2SpeciesReq = await axios.get(pokemon2Req.data.species.url);

  // == preprocessing == //
  const pokemon1Moves = pokemon1Req.data.moves.map((move) => ({
    name: move.move.name,
    url: move.move.url,
  }));
  const pokemon2Moves = pokemon2Req.data.moves.map((move) => ({
    name: move.move.name,
    url: move.move.url,
  }));
  const sharedMoves = pokemon1Moves.filter((move1) =>
    pokemon2Moves.find((move2) => move1.name === move2.name),
  );
  const notNormalMoves = sharedMoves.filter(async (move) => {
    try {
      const moveReq = await axios.get(move.url);
      return moveReq.data.type.name !== "normal";
    } catch (error) {
      return false;
    }
  });

  let arrayToUse = notNormalMoves;
  if (notNormalMoves.length === 0) {
    arrayToUse = sharedMoves;
  }
  // no shared moves
  if (arrayToUse.length === 0) {
    const pokemon1Name = getTextInEnglish(pokemon1SpeciesReq.data.names).name;
    const pokemon2Name = getTextInEnglish(pokemon2SpeciesReq.data.names).name;
    return await interaction.reply(
      `There are no shared moves between ${pokemon1Name} and ${pokemon2Name} :(`,
    );
  }

  const randomMove = arrayToUse[Math.floor(Math.random() * arrayToUse.length)];

  // == more requests == //
  const moveReq = await axios.get(randomMove.url);
  const moveTypeReq = await axios.get(moveReq.data.type.url);
  const moveDamageClassReq = await axios.get(moveReq.data.damage_class.url);

  // == data attributes == //
  const moveSprite = getTypeSprite(moveTypeReq.data.name);
  const moveName = getTextInEnglish(moveReq.data.names).name;
  const pokemon1Name =
    getTextInEnglish(pokemon1SpeciesReq.data.names).name ??
    toCapitalCase(pokemon1Req.data.name);
  const pokemon2Name =
    getTextInEnglish(pokemon2SpeciesReq.data.names).name ??
    toCapitalCase(pokemon2Req.data.name);
  const moveDamageClassDesc = getTextInEnglish(
    moveDamageClassReq.data.descriptions,
  ).description;
  let moveEffect = getTextInEnglish(moveReq.data.effect_entries).effect.replace(
    "\n",
    " ",
  );

  let moveDesc = getTextInEnglish(
    moveReq.data.flavor_text_entries,
  ).flavor_text.replace("\n", " ");

  if (moveDesc.length > 1024) {
    moveDesc = moveDesc.substring(0, 1021) + "...";
  }
  if (moveEffect.length > 1024) {
    moveEffect = moveEffect.substring(0, 1021) + "...";
  }

  const embed = new EmbedBuilder()
    .setTitle(
      `A random shared move that both ${pokemon1Name} and ${pokemon2Name} can learn is **${moveName}**`,
    )
    .setThumbnail(moveSprite)
    .setDescription(moveDesc)
    .addFields(
      { name: "Effect", value: moveEffect },
      {
        name: "Accuracy",
        value: `${moveReq.data.accuracy ?? 0}%`,
      },
      {
        name: "Damage Class",
        value: `${toCapitalCase(
          moveReq.data.damage_class.name,
        )} (${moveDamageClassDesc})`,
      },
    );

  await interaction.reply({ embeds: [embed] });
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
