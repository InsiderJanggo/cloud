const discord = require('discord.js');
const client = new discord.Client();
const {TOKEN, PREFIX} = require("./config");
const { Client, Collection } = require("discord.js");
const fs = require('fs');
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
client.event = new Collection();

client.on('ready', () => {
    console.log(`Logged In As ${client.user.username}`)
    client.user.setActivity("c!help", {
         type: "PLAYING"
    })
}) 

client.on("message", async(message) => {
    let prefix = PREFIX;
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) 
        command.run(client, message, args);
})


client.login(TOKEN);