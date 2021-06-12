const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "send help :D",
  execute(client, message, args) {
    if (args[0]) {
      const command = client.commands.get(args[0]);

      const embed = new MessageEmbed()
        .setTitle("Help")
        .setDescription(
          `**description:** ${command.description}\n **Admin only:** ${
            command.admin ? "Yes" : "No"
          }`
        );
      message.channel.send(embed);
    } else {
      const embed = new MessageEmbed().setTitle("Send Help");
      client.commands.forEach((cmd) => {
        embed.addField(cmd.name, cmd.description);
      });
      message.channel.send(embed);
    }
  },
};
