const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'skip',
    description: 'Skip the song to next Song',
    usage: '[skip]',
    category: 'music',
    run: async(client,message,args) => {
        const {channel} = message.member.voice;

            if (!channel) {
            //IF AUTHOR IS NOT IN VOICE CHANNEL
            let channelEmbed = new MessageEmbed()
            .setDescription("YOU NEED TO BE IN VOICE CHANNEL")
            .setColor('PURPLE')
            return message.channel.send(channelEmbed);
          }
          const serverQueue = message.client.queue.get(message.guild.id);

          if (!serverQueue) {
            return message.channel.send("There is nothing playing");
          }

          serverQueue.connection.dispatcher.end();
          let skipEmbed = new MessageEmbed()
          .setTitle('Skipped')
          .setDescription("✔ | Skipping The Song")
          .setColor('PURPLE')
          message.channel.send(skipEmbed);
    },
};