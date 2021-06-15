const { Client, MessageEmbed } = require("discord.js");

const client = new Client();
const config = require("../../config");
const glob = require("glob");
const { Collection } = require("discord.js");
const path = require("path");
client.on("ready", () => {
  client.user.setStatus("idle");
});
client.config = config;
client.commands = new Collection();
async function loadCmd() {
  const commandFiles = glob.sync("./src/bot/commands/*.js");
  for (const file of commandFiles) {
    const command = require(path.resolve(file));

    client.commands.set(command.name, command);
  }
}
loadCmd();
const prefix = "ap!";
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift();
  const command = client.commands.get(cmd);
  if (!command) return;
  if (command.admin && !config.admins.includes(message.author.id)) {
    return message.channel.send("Only admins can use this command.");
  }

  try {
    await command.execute(client, message, args);
  } catch (err) {
    console.log(err);
    message.reply("An error has occured.");
  }
});
const m = require("../models/user");
client.on("guildMemberRemove", async (member) => {
  await m.deleteOne({
    id: member.id,
  });

  const channel = client.channels.cache.get("800831211010129929");

  const embed = new MessageEmbed()
    .setTitle("Bye!")
    .setDescription(`${member.user.username} has left the server.`)
    .setThumbnail(
      member.user.displayAvatarURL({ format: "png", dynamic: true })
    )
    .setTimestamp();
  channel.send(embed);
});
client.on("guildMemberAdd", (member) => {
  const channel = client.channels.cache.get("800831211010129927");

  const embed = new MessageEmbed()
    .setTitle("Welcome!")
    .setDescription(`${member.user.username} has joined the server.`)
    .setThumbnail(
      member.user.displayAvatarURL({ format: "png", dynamic: true })
    )
    .setTimestamp();
  channel.send(embed);
});
client.login(config.discord_token);
