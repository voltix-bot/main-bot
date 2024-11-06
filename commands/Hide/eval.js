const { inspect } = require("util");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  prefixBased: {
    name: "eval",
    aliases: ["ev"],
    developer: true,
    async execute(message, args, client) {
      let code = args.join(" ");
      if (!code) return;
      if (code.endsWith("\n--async")) {
        code = code.replace("\n--async", "");
        code = `(async() => { ${code} })();`;
      }
      try {
        let { type, evaled } = await parseEval(eval(code));
        let output = evaled;
        if (typeof output !== "string") {
          output = `\`\`\`${inspect(evaled)}\`\`\``;
        }
        if (output.length > 4096) output = await client.hastebin(output);
        const embed = new EmbedBuilder()
          .setTitle("Eval Success")
          .setDescription(output)
          .addFields({ name: "Type:", value: `\`\`\`${type}\`\`\`` })
          .setColor("#00ff00")
          .setTimestamp();
        const sent = await message.channel.send({ embeds: [embed] });
        sent.react('🗑️');
        const filter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id;
        const collector = sent.createReactionCollector({ filter, time: 60000 });
        collector.on('collect', async (reaction, user) => {
          await sent.delete();
        })
      } catch (err) {
        let e = `\`\`\`${err}\`\`\``;
        if (err.length > 4096) e = await client.hastebin(err);
        const embed = new EmbedBuilder()
          .setTitle("Eval Error")
          .setColor("#ff0000")
          .setDescription(e)
          .setTimestamp();
        const sent = await message.channel.send({ embeds: [embed] });
        sent.react('🗑️');
        const filter = (reaction, user) => reaction.emoji.name === '🗑️' && user.id === message.author.id;
        const collector = sent.createReactionCollector({ filter, time: 60000 });
        collector.on('collect', async (reaction, user) => {
          await sent.delete();
        })
      }
    },
  },
};

async function parseEval(input) {
  const isPromise =
    input instanceof Promise &&
    typeof input.then === "function" &&
    typeof input.catch === "function";
  if (isPromise) {
    input = await input;
    return {
      evaled: input,
      type: `Promise<${parseType(input)}>`,
    };
  }
  return {
    evaled: input,
    type: parseType(input),
  };
}

function parseType(input) {
  if (input instanceof Buffer) {
    let length = Math.round(input.length / 1024 / 1024);
    let ic = "MB";
    if (!length) {
      length = Math.round(input.length / 1024);
      ic = "KB";
    }
    if (!length) {
      length = Math.round(input.length);
      ic = "Bytes";
    }
    return `Buffer (${length} ${ic})`;
  }
  return input === null || input === undefined
    ? "Void"
    : input.constructor.name;
}
