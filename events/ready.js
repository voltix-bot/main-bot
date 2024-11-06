module.exports = {
  name: 'ready',
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    console.log(`Bot is in ${client.guilds.cache.size} guilds`);
    console.log(`${client.commands.size} commands loaded`);

    client.user.setPresence({
      activities: [{ name: '.help', type: 'LISTENING' }],
      status: 'idle'
    });
  },
};