const { connect, connection } = require("mongoose");
const config = require("../../config");

connect(config.mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

connection.on("connected", () => {
  console.log("Connected to mongoDB!");
});
connection.on("reconnecting", () => {
  console.log("Reconnecting to mongoDB......");
});
connection.on("disconnected", () => {
  console.log("Disconnected from mongoDB");
});
