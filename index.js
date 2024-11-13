const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const express = require('express');
const client = new Client({ intents: Object.keys(GatewayIntentBits).map((a)=>{
    return GatewayIntentBits[a]
  })
});
require('dotenv').config();
const axios = require('axios');

client.commands = new Collection();
client.aliases = new Collection();
client.prefixBasedCommand = new Collection();
client.hastebin = async (text) => {
  const { data } = await axios.post(
    "https://brass-unique-crayon.glitch.me/documents",
    text,
  );
  return `https://brass-unique-crayon.glitch.me/${data.key}`;
};
const app = express();
const port = 22110;
const usersFilePath = path.join(__dirname, 'data/RPG/users.json');
app.get('/secret-endpoint', (req, res) => {
    const userID = req.params.userID;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        try {
            const users = JSON.parse(data);

            if (users[userID]) {
                res.json(users[userID]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to parse user data' });
        }
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
});

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

client.login(process.env.TOKEN);
