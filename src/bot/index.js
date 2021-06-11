const { Client } = require("discord.js");

const client = new Client();
const config = require("../../config");
const glob = require("glob");
const { Collection } = require("discord.js");
const path = require("path");
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
const prefix = "api!";
client.on("message", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.split(prefix.length).trim().split(/ +/g);
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
client.login(config.discord_token);
