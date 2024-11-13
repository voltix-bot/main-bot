const { EmbedBuilder } = require('discord.js');
const { getInventory, getWeapons } = require('../../handler/rpghandler');
const emoji = require('../../data/RPG/list_emoji.json');
const users = require('../../data/RPG/users.json');

module.exports = {
	prefixBased: {
		name: 'inventory',
		aliases: ['inv'],
		description: 'check whats in the inventory',
		async execute(message, args, client) {
			const inventory = getInventory(message.author.id);
			const weapons = getWeapons(message.author.id);

			let inv = [];
			if (!inventory.length) inv.push('there is nothing here');
			inventory.forEach((item) => {
				inv.push(`> ${emoji[item.type]} • **${item.name}** • **${item.value}**`);
			});
			let weapon = []
			if (!weapons.length) weapon.push('there is nothing here');
			weapons.forEach((item) => {
				weapon.push(`> ${emoji.sword} • **${item.name}** • **${item.value}**`);
			});

			const user = users[message.author.id]; 
			const embedColor = user ? user['inventory-color'] : '#e6e3e3';

			const embed = new EmbedBuilder()
				.setTitle(`${message.author.username}'s Inventory`)
				.setThumbnail(message.author.avatarURL())
				.setColor(embedColor)
				.setDescription(`> **Inventory**:\n ${inv.join('\n')} \n> **Weapons**:\n ${weapon.join('\n')} `)
				.setTimestamp();

			await message.channel.send({ embeds: [embed] });
		}
	}
};
