const { exec } = require('child_process');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  prefixBased: {
    name: 'execute',
    aliases: ['exec'],
    developer: true,
    async execute(message, args, client) {
      const command = args.join(' ');
      if (!command) {
        embed.setTitle('Execute Error')
        embed.setDescription('No command given.')
        embed.setColor('#ff0000');
      }
      exec(command, async(error, stdout, stderr) => {
        if (error) {
          const err = error.toString();
          let finalError = `\`\`\`${err}\`\`\``
          if(err.length > 4096) finalError = client.hastebin(stdErr);
		  const embed = new EmbedBuilder()
          .setTitle('Execute Error')
          .setDescription(finalError)
		  .setTimestamp()
          .setColor('#ff0000');
          return await message.channel.send({ embeds: [embed] });
        }
        if (stderr) {
          const stdErr = stderr.toString();
          let finalStderr = `\`\`\`${stdErr}\`\`\``
          if(stdErr.length > 4096) finalStderr = client.hastebin(stdErr);
		  const embed = new Embedbuilder()
          .setTitle('Execute Error')
          .setDescription(finalStderr)
		  .setTimestamp()
          .setColor('#ff0000');
          return await message.channel.send({ embeds: [embed] });
        }
        
        const output = stdout.toString();
        let finalOutput = `\`\`\`${output}\`\`\``
        if (output.length > 4096) finalOutput = client.hastebein(output);
		const embed = new EmbedBuilder()
        .setTitle('Execute Success')
        .setDescription(finalOutput)
		.setTimestamp()
        .setColor('#00ff00');

		return await message.channel.send({ embeds: [embed] });
      })
    }
  }
}