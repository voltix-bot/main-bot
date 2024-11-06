const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Provides information about bot latency!'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const PingEmbed = new EmbedBuilder()
            .setColor('#00FFFF')
            .setTitle('Bot Latency')
            .setDescription(`⌛ Bot: **${latency}**ms\n🌐 Websocket: **${interaction.client.ws.ping}ms**`)
            .setFooter({ text: 'Bot Ping' })
        await interaction.editReply({ content: '', embeds: [PingEmbed]});
    },
    prefixBased: {
        name: 'ping',
        aliases: ['pong'],
        description: "Provides information about the bot's latency!",
        developer: false,
        async execute(message, args, client) {
            const sent = await message.channel.send({ content: 'Pinging...', fetchReply: true });
            const latency = sent.createdTimestamp - message.createdTimestamp;
            const PingEmbed2 = new EmbedBuilder()
                .setColor('#00FFFF')
                .setTitle('Bot Latency')
                .setDescription(`⌛ Bot: **${latency}**ms\n🌐 Websocket: **${client.ws.ping}**ms`)
                .setFooter({ text: 'Bot Ping' })
            await sent.edit({ content: '', embeds: [PingEmbed2]});
        }
    }
};
