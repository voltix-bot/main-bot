const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];

const loadCommands = (dir) => {
    fs.readdirSync(dir).forEach(cmdDir => {
        const files = fs.readdirSync(path.join(dir, cmdDir)).filter(file => file.endsWith('.js'));
        for (const file of files) {
            const command = require(path.join(dir, cmdDir, file));
            commands.push(command.data.toJSON());
        }
    })
};

loadCommands(path.join(__dirname, 'commands'));

const rest = new REST({ version: '10' }).setToken(process.env['TOKEN']);

(async () => {
    try {
        console.log('Started refreshing global application (/) commands.');

        await rest.put(
            Routes.applicationCommands('1302559238589120545'),
            { body: commands },
        );

        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();