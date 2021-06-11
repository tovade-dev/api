const fetch = require("node-fetch").default;
module.exports = {
  name: "key",
  description: "Use this command if you lost your api key!",
  async execute(client, message, args) {
    const res = await (
      await fetch(
        "https://api.tovade.xyz/admin/user/info?userID=" + message.author.id,
        {
          method: "GET",
          headers: { auth: client.config.adminkey },
        }
      )
    ).json();

    if (res.error) return message.channel.send(res.message);

    await message.channel.send("I will DM you your key!");
    message.author
      .send(`Your API key: \`${res.key}\``)
      .catch(() =>
        message.reply("Please enable your dms so i can dm your info!")
      );
  },
};
