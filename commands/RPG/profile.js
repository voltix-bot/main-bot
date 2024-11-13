const { EmbedBuilder } = require('discord.js');
const { get } = require('../../data/RPG/users');

module.exports = {
    prefixBased: {
        name: 'profile',
        description: 'Check your Voltix RPG account',
        developer: false,
        async execute(message, args, client) {
            const id = message.mentions.users?.first()?.id || message.author.id;
            let embed;

            const data = get(id);
            const author = client.users.cache.get(id);

            if (!data) {
                return message.channel.send('User has not registered yet! Please use `.register` to register.');
            }

            const profileColor = data["profile-color"] || "00AE86";

            const badges = data.badges && data.badges.length > 0 ? data.badges.join(', ') : 'This user has no badges';

            embed = new EmbedBuilder()
                .setTitle(`${author.username}'s Profile`)
                .setColor(`#${profileColor}`)
                .addFields(
                    { name: 'EXP & Level', value: `<:level:1306291907894444032> ${data.level} **||** <a:XP:1306287290309546006> ${data.exp}`, inline: true },
                    { name: 'Balance', value: `<:coins:1306288037604622406> ${data.money}`, inline: true },
                    { 
                        name: 'Stats', 
                        value: `<:AttackPoints:1306288414168977408> ${data.stats.attack}\n<:MagicPoints:1306288712136527874> ${data.stats.magic}\n🌀 ${data.stats.mana}\n<:HealthPoints:1306288977044832388> ${data.stats.health_point}\n<:SpeedPoints:1306289995681632368> ${data.stats.speed}\n<:DefensePoints:1306290161226747945> ${data.stats.defense}`, 
                        inline: false 
                    },
                    { name: 'Stats Points', value: `📊 ${data.stats_point}`, inline: true },
                    { 
                        name: 'Equipments', 
                        value: `<:sword:1306134613646770239> ${data.equipped_weapon || 'None'}\n<:helmet:1306234982909476936> ${data.armor.helm || 'None'}\n<:belt:1306227846531780611> ${data.armor.necklace || 'None'}\n<:clothes:1306237364368048139> ${data.armor.clothes || 'None'}\n<:ring:1306233549955010621> ${data.armor.ring || 'None'}\n<:gauntlet:1306142808675061791> ${data.armor.gauntlet || 'None'}\n<:belt:1306227846531780611> ${data.armor.belt || 'None'}\n<:boots:1306232036041953332> ${data.armor.boots || 'None'}`, 
                        inline: false
                    },
                    { name: 'Badges', value: badges, inline: false }
                )
                .setThumbnail(author.avatarURL())
                .setTimestamp();

            await message.channel.send({ embeds: [embed] });
        }
    }
};
