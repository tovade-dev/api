const fetch = require("node-fetch").default;
module.exports = {
  name: "register",
  description: "Register on the api and get an api key!",
  async execute(client, message, args) {
    const res = await (
      await fetch(
        "https://api.tovade.xyz/admin/register?userID=" + message.author.id,
        {
          method: "POST",
          headers: { auth: client.config.adminkey },
        }
      )
    ).json();

    if (res.error) return message.channel.send(res.message);

    await message.channel.send(
      "You are now registered, I will DM you your info!"
    );
    message.author
      .send(`Your API key: \`${res.key}\``)
      .catch(() =>
        message.reply("Please enable your dms so i can dm your info!")
      );
  },
};
