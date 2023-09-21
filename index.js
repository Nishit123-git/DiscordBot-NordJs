require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();

const PREFIX = "!"; // Define your command prefix

let interval;

client.on('message', async (msg) => {
  if (msg.author.bot) return; // Ignore messages from bots

  if (msg.content.startsWith(PREFIX)) {
    const args = msg.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    switch (command) {
      case "ping":
        msg.reply("Pong!");
        break;
      case "meme":
        msg.channel.send("Here's your meme!");
        const img = await getMeme();
        msg.channel.send(img);
        break;
      case "eye":
        msg.channel.send("You are now subscribed to eye reminders.");
        interval = setInterval(function () {
          msg.channel.send("Please take an eye break now!").catch(console.error);
        }, 3600000); // Every hour
        break;
      case "stop":
        msg.channel.send("I have stopped eye reminders.");
        clearInterval(interval);
        break;
    }
  }
});

async function getMeme() {
  try {
    const res = await axios.get('https://memegen.link/api/templates/');
    const templates = res.data;
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const memeImageUrl = `https://memegen.link/${randomTemplate.id}.jpg`;
    return memeImageUrl;
  } catch (error) {
    console.error("Error fetching meme:", error);
    return "An error occurred while fetching the meme.";
  }
}

// Must be the last line
client.login(process.env.CLIENT_TOKEN);
