const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'stop',
    description: 'Stop The Playing Music',
    usage: '[stop]',
    category: 'music',
    run: async(client,message,args) => {
        const {channel} = message.member.voice;
        const user = message.author.tag;
            if (!channel) {
            //IF AUTHOR IS NOT IN VOICE CHANNEL
            return message.reply("YOU NEED TO BE IN VOICE CHANNEL");
              }

              const serverQueue = message.client.queue.get(message.guild.id);
              if (!serverQueue) {
                return message.reply("There is nothing playing that i could stop");
              }

              serverQueue.songs = [];
              serverQueue.connection.dispatcher.end();
              var embed = new MessageEmbed()
              .setDescription("**Stoped the playing music**")
              .setTimestamp()
              .setColor('PURPLE')
              .setFooter(`Stopped By ${user}`)
              serverQueue.textChannel.send(embed);
    }
}