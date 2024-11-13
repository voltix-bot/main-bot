const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const users = require('../../data/RPG/users');

module.exports = {
  prefixBased: {
    name: 'register',
    description: 'register to start playing!',
    aliases: ['reg'],
    developer: false,
    async execute(message, args, client) {
      const id = message.author.id;

      // Check if user already has an account
      if (users.get(id)) {
        return message.reply('You have already registered!');
      }

      const termsEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('Terms of Service & Privacy Policy')
        .setDescription(
          "By registering, you agree to our **[Terms of Service](https://voltix.celebimew.net/terms)** and **[Privacy Policy](https://voltix.celebimew.net/terms)**."
        )
        .setFooter({ text: 'Please agree or disagree using the buttons below.' });

      const actionRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('agree')
            .setLabel('Agree')
            .setStyle('Success'),
          new ButtonBuilder()
            .setCustomId('disagree')
            .setLabel('Disagree')
            .setStyle('Danger')
        );

      // Send the Terms of Service embed and buttons
      const confirmMessage = await message.reply({
        embeds: [termsEmbed],
        components: [actionRow]
      });

      const filter = (interaction) => interaction.user.id === message.author.id;

      const collector = confirmMessage.createMessageComponentCollector({
        filter,
        time: 30000, 
      });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'agree') {
          const data = {
            "id": id,
            "money": 500,
            "level": 1,
            "exp": 1,
            "cleared_quest": 0,
            "equipped_weapon": null,
            "owned_skills": [],
            "stats": {
              "attack": 5,
              "magic": 5,
              "health_point": 100,
              "mana": 100,
              "speed": 5,
              "defense": 5
            },
            "stats_point": 0,
            "inventory": [],
            "armor": {
              "helm": null,
              "boots": null,
              "necklace": null,
              "ring": null,
              "belt": null,
              "gauntlet": null,
              "clothes": null
            },
            "obtained_weapon": []
          };

          try {
            // Save the user data if they don't already exist
            users.set(id, data);
            await interaction.reply('Successfully registered!');
          } catch (e) {
            await interaction.reply(`Error: ${e}`);
          }
        } else if (interaction.customId === 'disagree') {
          await interaction.reply('Registration canceled. You did not agree to the terms.');
        }

        // Disable buttons and retain their custom IDs
        confirmMessage.edit({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder().setCustomId('agree').setLabel('Agree').setStyle('Success').setDisabled(true),
              new ButtonBuilder().setCustomId('disagree').setLabel('Disagree').setStyle('Danger').setDisabled(true)
            )
          ]
        });

        collector.stop();
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          confirmMessage.edit({
            content: 'You did not respond in time. Registration canceled.',
            components: []
          });
        }
      });
    }
  }
};
