const { prefix, developer, public } = require('../config.json');

module.exports = {
  name: 'messageCreate',
  execute(message, client) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.prefixBasedCommand.get(commandName) || client.prefixBasedCommand.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (!public && !developer.includes(message.author.id)) return message.reply('This bot is not public yet.', { ephemeral: true });
    if (command.developer && !developer.includes(message.author.id)) return;
    try {
      command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}