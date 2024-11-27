const {
  ActionRowBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("api")
    .setDescription("Learn how to use the API to view an RPG profile"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Learn how to use the API to view an RPG profile")
      .setDescription(
        "Send a GET request to `https://api.voltix.celebimew.net/api/v1/profiles/<userID>`\nYou'll receive a JSON response\n**Example:**\n```json\n" +
        JSON.stringify(
          {
            id: "790482900642431036",
            "profile-color": "9b59b6",
            "inventory-color": "#fc035e",
            money: 500,
            level: 1,
            exp: 1,
            badges: [
              "<:Developer:1306295016255127694> **Developer**\n<:GithubContributor:1311390116706517124><:Contributors:1306297262934327306><:Hoster:1309212913302507550> **Contributor**",
            ],
            cleared_quest: 0,
            equipped_weapon: "ADMIN STAFF",
            owned_skills: [],
            stats: {
              attack: 5,
              magic: 5,
              health_point: 100,
              mana: 100,
              speed: 5,
              defense: 5,
            },
            stats_point: 0,
            inventory: [],
            armor: {
              helm: "ADMIN HELMET",
              boots: "ADMIN BOOTS",
              necklace: "ADMIN NECKLACE",
              ring: "ADMIN RING",
              belt: "ADMIN BELT",
              gauntlet: "ADMIN GAUNTLET",
              clothes: "ADMIN CHESTPLATE",
            },
            obtained_weapon: [
              {
                name: "ADMIN SWORD",
                effect: {
                  attack: 999999999999,
                },
                rarity: "ADMIN",
                value: 0,
              },
            ],
          },
          null,
          2
        ) +
        "\n```\n**[Learn More!](https://dev.celebimew.net/api) || [Status Page](https://status.celebimew.net/)**"
      )
      .setColor("#029dcc");

    const button = new ButtonBuilder()
      .setLabel("Learn More!")
      .setStyle(ButtonStyle.Link)
      .setURL("https://dev.celebimew.net/api");

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
  prefixBased: {
    name: "api",
    description: "Learn how to use the API to view an RPG profile",
    developer: false,
    async execute(message) {
      const embed = new EmbedBuilder()
        .setTitle("Learn how to use the API to view an RPG profile")
        .setDescription(
          "Send a GET request to `https://api.voltix.celebimew.net/api/v1/profiles/<userID>`\nYou'll receive a JSON response\n**Example:**\n```json\n" +
          JSON.stringify(
            {
              id: "790482900642431036",
              "profile-color": "9b59b6",
              "inventory-color": "#fc035e",
              money: 500,
              level: 1,
              exp: 1,
              badges: [
                "<:Developer:1306295016255127694> **Developer**\n<:GithubContributor:1311390116706517124><:Contributors:1306297262934327306><:Hoster:1309212913302507550> **Contributor**",
              ],
              cleared_quest: 0,
              equipped_weapon: "ADMIN STAFF",
              owned_skills: [],
              stats: {
                attack: 5,
                magic: 5,
                health_point: 100,
                mana: 100,
                speed: 5,
                defense: 5,
              },
              stats_point: 0,
              inventory: [],
              armor: {
                helm: "ADMIN HELMET",
                boots: "ADMIN BOOTS",
                necklace: "ADMIN NECKLACE",
                ring: "ADMIN RING",
                belt: "ADMIN BELT",
                gauntlet: "ADMIN GAUNTLET",
                clothes: "ADMIN CHESTPLATE",
              },
              obtained_weapon: [
                {
                  name: "ADMIN SWORD",
                  effect: {
                    attack: 999999999999,
                  },
                  rarity: "ADMIN",
                  value: 0,
                },
              ],
            },
            null,
            2
          ) +
          "\n```\n**[Learn More!](https://dev.celebimew.net/api) || [Status Page](https://status.celebimew.net)**"
        )
        .setColor("#029dcc");

      const button = new ButtonBuilder()
        .setLabel("Learn More!")
        .setStyle(ButtonStyle.Link)
        .setURL("https://dev.celebimew.net/api");

      const row = new ActionRowBuilder().addComponents(button);

      const msg = await message.channel.send({
        embeds: [embed],
        components: [row],
      });

      setTimeout(async () => {
        msg.edit({ components: [] });
      }, 30000);
    },
  },
};
