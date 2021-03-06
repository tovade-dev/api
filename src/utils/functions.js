const fetch = require("node-fetch");
const moment = require("moment");
async function fetchPkg(pkg) {
  const res = await fetch(
    `https://registry.npmjs.com/${encodeURIComponent(pkg)}`
  ).catch();
  if (res.status === 404)
    return { error: true, message: "Package does not exist." };
  const body = await res.json();
  return {
    description: body.description || "No description.",
    version: body["dist-tags"].latest,
    license: body.license || "None",
    author: body.author ? body.author.name : "Unknown User.",
    createdAt: moment.utc(body.time.created).format("YYYY/MM/DD hh:mm:ss"),
    last_modify: body.time.modified
      ? moment.utc(body.time.modified).format("YYYY/MM/DD hh:mm:ss")
      : "has never been modified",
    repository: body.repository
      ? `[View Here](${body.repository.url.split("+")[1]})`
      : "None",
    maintainers: body.maintainers.map((user) => user.name).join(", "),
  };
}
async function fetchSub(sub) {
  const dataRes = await fetch(
    `https://reddit.com/r/${sub}/new.json?limit=1`
  ).then((rese) => rese.json());
  if (dataRes.statusCode === 404) return "Invalid subreddit?";
  const post = dataRes.data.children[0];
  const p = post?.data;
  if (!p) return { error: true, message: "Subreddit does not exist." };
  return {
    title: p.title || "",
    url: p.url || "",
    thumbnail: p.thumbnail,
    published: moment.utc(p.created_utc).format("YYYY/MM/DD hh:mm:ss"),
    permalink: `https://reddit.com${p.permalink}`,
    nsfw: p.over_18,
    author: {
      name: p.author || "Deleted",
    },
    sub: {
      name: p.subreddit || sub,
    },
    extra: {
      score: p.score,
    },
    votes: {
      upvotes: p.ups,
      downvotes: p.downs,
    },
  };
}
const genius = require("@tovade/genius-lyrics");
const config = require("../../config");

async function fetchLyrics(song) {
  const g = new genius.Client(config.genius);
  const searches = await g.songs.search(song);
  const firstSong = searches[0];
  const lyrics = await firstSong.lyrics();

  return {
    thumbnail: firstSong.raw.song_art_image_thumbnail_url,
    title: firstSong.raw.title,
    author: firstSong.raw.primary_artist.name,
    lyrics: lyrics || "No Lyrics found.",
  };
}
async function fetchAnimal(type) {
  const data = await fetch(`https://some-random-api.ml/animal/${type}`).then(
    (d) => d.json()
  );

  return {
    fact: data.fact,
    image: data.image,
  };
}
module.exports = {
  fetchPkg,
  fetchSub,
  fetchLyrics,
  fetchAnimal,
};
