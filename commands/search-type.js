const { SlashCommandBuilder } = require("discord.js");
const { data } = require("../data");
const { EmbedBuilder } = require("@discordjs/builders");
const { api } = require("../api");
const {
  getTextInEnglish,
  getTypeSprite,
  toCapitalCase,
} = require("../helpers");

// ===== Command Schema ==== //
const commandSchema = new SlashCommandBuilder()
  .setName("search-type")
  .setDescription("Searchs a type and gives a description")
  .addStringOption((option) =>
    option
      .setRequired(true)
      .setName("type")
      .setDescription("type to search for")
      .addChoices(...data.types),
  );

// === Command Execution === //
const execute = async (interaction) => {
  // doesnt require validation as types are less than 25 and loaded through the addChoices method

  // == inputs == //
  const typeToQuery = interaction.options.getString("type");

  // == requests == //
  const typeReq = await api.getType(typeToQuery);

  // == data attributes == //
  const typeName = getTextInEnglish(typeReq.data.names).name;
  const damageRelations = [];
  for (const key in typeReq.data.damage_relations) {
    const relatedTypes = typeReq.data.damage_relations[key].map(
      (relation) => relation.name,
    );

    if (relatedTypes.length <= 0) continue;

    damageRelations.push({
      name: key.replace(/_/g, " ").toUpperCase(),
      value: typeReq.data.damage_relations[key]
        .map((relation) => toCapitalCase(relation.name))
        .join(", "),
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(typeName)
    .setDescription(
      `This type contains **${typeReq.data.pokemon.length} pokemons** and **${typeReq.data.moves.length} moves**`,
    )
    .addFields(...damageRelations)
    .setThumbnail(getTypeSprite(typeReq.data.name));

  await interaction.reply({ embeds: [embed] });
};

// === Exports === //
module.exports = {
  data: commandSchema,
  execute,
};
