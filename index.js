const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const client = new Client({ intents: Object.keys(GatewayIntentBits).map((a)=>{
    return GatewayIntentBits[a]
  })
});
const axios = require('axios');

client.commands = new Collection();
client.aliases = new Collection();
client.prefixBasedCommand = new Collection();
client.hastebin = async (text) => {
  const { data } = await axios.post(
    "https://brass-unique-crayon.glitch.me/documents", //https://331bf875-fcd5-46f0-8315-71e02dd6d025-00-3pgcvsr36mpcs.kirk.replit.dev/documents
    text,
  );
  return `https://brass-unique-crayon.glitch.me/${data.key}`;
};

const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach((dir) => {
  const commandFiles = fs.readdirSync(path.join(commandsPath, dir)).filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
      const filePath = path.join(commandsPath, dir, file);
      const command = require(filePath);
      if (command.prefixBased) {
          command.prefixBased.category = dir;
          client.prefixBasedCommand.set(command.prefixBased.name, command.prefixBased);
          if(command.prefixBased.aliases && command.prefixBased.aliases.size > 0) {
              command.prefixBased.aliases.forEach(alias => {
                  client.aliases.set(alias, command.prefixBased.name);
              });
          }
      }
      if (command.data) client.commands.set(command.data.name, command);
  }
})

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.login(process.env['TOKEN']);