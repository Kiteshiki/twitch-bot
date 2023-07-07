// Require necessary node modules
// Make the variables inside the .env element available to our Node project
require("dotenv").config();

const tmi = require("tmi.js");

// Setup connection configurations
// These include the channel, username and password
const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },

  // Lack of the identity tags makes the bot anonymous and able to fetch messages from the channel
  // for reading, supervision, spying, or viewing purposes only
  identity: {
    username: `${process.env.TWITCH_USERNAME}`,
    password: `oauth:${process.env.TWITCH_OAUTH}`,
  },

  // Lack of the identity tags makes the bot anonymous and able to fetch messages from the channel
  // for reading, supervision, spying, or viewing purposes only
  channels: [`${process.env.TWITCH_CHANNEL}`],
});

// Connect to the channel specified using the setings found in the configurations
// Any error found shall be logged out in the console
client.connect().catch(console.error);

const users = [];
const excludeUsers = ["moobot"];

// We shall pass the parameters which shall be required
client.on("message", (channel, tags, message, self) => {
  // Lack of this statement or it's inverse (!self) will make it in active
  if (self) return;

  const shouldSaveUser =
    !excludeUsers.includes(tags.username) && !users.includes(tags.username);

  if (shouldSaveUser) {
    users.push(tags.username);
  }

  handleCommands(channel, tags, message.toLowerCase());

  // This logs out all the messages sent on the channel on the terminal
  console.log({ message, users });
});

const handleCommands = (channel, tags, message) => {
  switch (true) {
    case message.startsWith("!кто"):
      const randomUser = users[Math.floor(Math.random() * users.length)];

      client.say(channel, `@${tags.username} мне кажется это ${randomUser}`);
      break;
    case message.startsWith("!iq"):
      const randomIQ = Math.floor(Math.random() * 200);
      client.say(channel, `@${tags.username} твой iq ${randomIQ}`);
      break;
    default:
  }
};
