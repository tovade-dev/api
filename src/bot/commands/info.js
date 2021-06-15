const fetch = require("node-fetch");
module.exports = {
  name: "info",
  description: "Info",
  async execute(client, message, args) {
    const res = await fetch(
      "http://api.tovade.xyz/v1/admin/user/info?userID=" + message.author.id,
      {
        method: "GET",
        headers: {
          auth: client.config.adminkey,
        },
      }
    ).then((r) => r.json());
    if (!res) return message.channel.send(`You are not registered.`);
    if (res.error) return message.channel.send(res.message);

    const toSend = {
      content: `Your stats`,
      embed: {
        fields: [],
        color: 0xffa500,
      },
    };
    toSend.embed.fields.push({
      name: "Request",
      value: `Total: ${res.stats.total}`,
      inline: true,
    });
    toSend.embed.fields.push({
      name: "Rate-limit",
      value: `Max: ${res.ratelimit.max}\nUsed: ${res.ratelimit.used}`,
      inline: true,
    });
    message.channel.send(toSend);
  },
};
