const fetch = require("node-fetch").default;
module.exports = {
  name: "more",
  description: "add request to user",
  admin: true,
  async execute(client, msg, args) {
    const user =
      msg.mentions.users.first() ||
      msg.channel.guild.members.get(args[0]).user ||
      msg.author;

    const amount = parseInt(args[1]);
    if (!amount) return msg.channel.send("How much?");

    const res = await (
      await fetch(
        "https://api.tovade.xyz/add?userID=" + user.id + "&amount=" + amount,
        {
          method: "POST",
          headers: { auth: client.config.adminkey },
        }
      )
    ).json();

    if (res.error) return msg.channel.send(res.message);

    msg.channel.send(
      `${user.username}#${user.discriminator}'s max rate-limit is now ${res.ratelimit.max}`
    );
  },
};