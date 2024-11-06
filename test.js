const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

const languageConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/L-ID.json'), 'utf-8'));

module.exports = {
    name: 'test',
    description: 'Sends a different embed based on server language setting',

    execute(message) {
        const isLanguage1 = languageConfig.includes(message.guild.id);

        let embed;

        if (isLanguage1) {
            embed = new MessageEmbed()
                .setColor('#00FF00')
                .setTitle('L1')
                .setDescription('L1')
                .setFooter('L1');
        } else {
            embed = new MessageEmbed()
                .setColor('#FF0000')
                .setTitle('L2')
                .setDescription('L2')
                .setFooter('Language 2 Footer');
        }

        message.channel.send({ embeds: [embed] });
    }
};
