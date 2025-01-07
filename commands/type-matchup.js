const { SlashCommandBuilder } = require("discord.js");
const { data } = require("../data.js");
const { getTypeSprite, getTextInEnglish } = require("../helpers.js");
const { api } = require("../api.js");
const { EmbedBuilder } = require("@discordjs/builders");

// ===== Command Schema ==== //
const commandSchema = new SlashCommandBuilder()
  .setName("type-matchup")
  .setDescription(
    "Displays the effectiveness of one Pokémon type against another",
  )
  .addStringOption((option) =>
    option
      .setRequired(true)
      .setName("attacking-type")
      .setDescription("The type of the attacking move (e.g., Fire).")
      .addChoices(...data.types),
  )
  .addStringOption((option) =>
    option
      .setRequired(true)
      .setName("defending-type")
      .setDescription("The type of the defending Pokémon (e.g., Water).")
      .addChoices(...data.types),
  );

// === Command Execution === //
const execute = async (interaction) => {
  // doesnt require validation as types are less than 25 and loaded through the addChoices method

  // == inputs == //
  const attackingType = interaction.options.getString("attacking-type");
  const defendingType = interaction.options.getString("defending-type");

  // == requests == //
  const attackingTypeReq = await api.getType(attackingType);
  const defendingTypeReq = await api.getType(defendingType);

  // == data attributes == //
  const attackingTypeName = getTextInEnglish(attackingTypeReq.data.names).name;
  const defendingTypeName = getTextInEnglish(defendingTypeReq.data.names).name;
  const attackImage = new EmbedBuilder().setImage(
    getTypeSprite(attackingTypeReq.data.name),
  );
  const defendImage = new EmbedBuilder().setImage(
    getTypeSprite(defendingTypeReq.data.name),
  );

  const titleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(
      `Type Matchup: ${attackingTypeName} pokemon attacking ${defendingTypeName} pokemon`,
    );
  const textEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setDescription(
      `**${attackingTypeName}** deals ${
        defendingTypeReq.data.damage_relations.double_damage_from.some(
          (type) => type.name === attackingType,
        )
          ? "2x"
          : defendingTypeReq.data.damage_relations.half_damage_from.some(
                (type) => type.name === attackingType,
              )
            ? "0.5x"
            : defendingTypeReq.data.damage_relations.no_damage_from.some(
                  (type) => type.name === attackingType,
                )
              ? "0x"
              : "1x"
      } damage to **${defendingTypeName}**`,
    );

  return interaction.reply({
    embeds: [titleEmbed, attackImage, defendImage, textEmbed],
  });
};

// === Exports === //
module.exports = {
  data: commandSchema,
  execute,
};
