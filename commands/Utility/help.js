const {
  ActionRowBuilder,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information about bot commands!")
    .addStringOption((opt) =>
      opt
        .setName("category")
        .setDescription("The category of commands to show!")
        .setRequired(false)
        .addChoices(
          { name: "Moderation", value: "Moderate" },
          { name: "Utility", value: "Utility" },
        ),
    ),
  async execute(interaction) {
    const category =
      interaction.options.getString("category")?.charAt(0)?.toUpperCase() +
      interaction.options.getString("category")?.slice(1) || undefined;

    const embed = new EmbedBuilder()
      .setColor("#00FFFF")
      .setTimestamp();

    if (category) {
      const commands = interaction.client.prefixBasedCommand.filter(
        (command) => command.category === category,
      );

      embed.setTitle(`Commands in ${category}`);
      if (commands.size > 0) {
        const commandList = commands.map(cmd => `\`${cmd.name}\` - **${cmd.description}**`).join("\n");
        embed.setDescription(commandList);
      } else {
        embed.setDescription(`No commands available in the ${category} category.`);
      }
    } else {
      const commands = interaction.client.prefixBasedCommand;
      const groupedCommands = Array.from(commands.values()).reduce(
        (acc, command) => {
          if (command.category === 'Hide')
          if (!acc[command.category]) {
            acc[command.category] = [];
          }
          acc[command.category].push({
            name: command.name,
            description: command.description,
          });
          return acc;
        },
        {},
      );

      embed.setTitle("All Commands");
      const commandDescriptions = Object.entries(groupedCommands).map(([category, cmds]) => {
        return `**${category}:**\n` + cmds.map((cmd) => `\`${cmd.name}\` - **${cmd.description}**`).join("\n");
      }).join("\n\n");

      embed.setDescription(commandDescriptions);
    }

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("selectCategory")
      .setPlaceholder("Choose a category")
      .addOptions([
        {
          label: "Utility",
          value: "Utility",
          description: "Select utility category",
        },
        {
          label: "Moderation",
          value: "Moderate",
          description: "Select moderation category",
        },
      ]);
    const row = new ActionRowBuilder().addComponents(selectMenu);

    await interaction.reply({ embeds: [embed], components: [row] });
    setTimeout(async() => {
      await interaction.editReply({ components: [] });
    }, 30000)
  },
  prefixBased: {
    name: "help",
    description: "Provides information about bot commands!",
    developer: false,
    aliases: ["h"],
    async execute(message, args, client) {
      const commands = client.prefixBasedCommand;
      const groupedCommands = Array.from(commands.values()).reduce(
        (acc, command) => {
          if (!acc[command.category]) {
            acc[command.category] = [];
          }
          acc[command.category].push({
            name: command.name,
            description: command.description,
          });
          return acc;
        },
        {},
      );

      const embed = new EmbedBuilder()
        .setTitle("All Commands")
        .setColor("#00FFFF")
        .setTimestamp();

      const commandDescriptions = Object.entries(groupedCommands).map(([category, cmds]) => {
        return `**${category}:**\n` + cmds.map((cmd) => `\`${cmd.name}\` - **${cmd.description}**`).join("\n");
      }).join("\n\n");

      embed.setDescription(commandDescriptions);

      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId("selectCategory")
        .setPlaceholder("Choose a category")
        .addOptions([
          {
            label: "Utility",
            value: "Utility",
            description: "Select utility category",
          },
          {
            label: "Moderation",
            value: "Moderate",
            description: "Select moderation category",
          },
        ]);
      const row = new ActionRowBuilder().addComponents(selectMenu);
      const msg = await message.channel.send({ embeds: [embed], components: [row] });
      setTimeout(async () => {
        msg.edit({ components: [] });
      }, 30000);
    },
  },
  async selectCategory(interaction) {
    const category = interaction.values[0];
    const commands = interaction.client.prefixBasedCommand.filter(cmd => cmd.category === category);

    const embed = new EmbedBuilder()
      .setTitle(`Commands in ${category}`)
      .setColor("#00FFFF")
      .setTimestamp();

    if (commands.length > 0) {
      const commandList = commands.map(cmd => `\`${cmd.name}\` - **${cmd.description}**`).join("\n");
      embed.setDescription(commandList);
    } else {
      embed.setDescription(`No commands available in the ${category} category.`);
    }

    await interaction.update({ embeds: [embed], components: [] });
  },
};
