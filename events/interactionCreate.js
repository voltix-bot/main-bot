const config = require("../config.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (
            interaction.isStringSelectMenu() &&
            interaction.customId === "selectCategory"
        ) {
            const category = interaction.values[0];
            const commands = client.prefixBasedCommand.filter(
                (command) => command.category === category,
            );
            const embed = new EmbedBuilder()
                .setTitle(`Commands in ${category}`)
                .setColor("#00FFFF")
                .setTimestamp();

            const commandDescriptions = commands
                .map((cmd) => `\`${cmd.name}\` - **${cmd.description}**`)
                .join("\n");
            embed.setDescription(
                `Commands in this category:\n${commandDescriptions}`,
            );
            if (commands.size > 0) {
                const commandList = commands
                    .map((cmd) => `\`${cmd.name}\` - **${cmd.description}**`)
                    .join("\n");
                embed.setDescription(commandList);
            } else {
                embed.setDescription(
                    `No commands available in the ${category} category.`,
                );
            }

            await interaction.update({ embeds: [embed] });
            setTimeout(async () => {
                interaction.editReply({ components: [] });
            }, 30000);
        }

        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        if (!command) return;
        if (!config.public) {
            if (!config.developer.includes(interaction.user.id)) {
                return interaction.reply({
                    content: "Not available right now.",
                    ephemeral: true,
                });
            }
        }
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
