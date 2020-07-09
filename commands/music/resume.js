const {MessageEmbed} = require('discord.js');

module.exports = {
    name: 'resume',
    description: "Resume the paused Song",
    usage: '[resume]',
    category: 'music',
    run: async(client,message,args) => {
        const { channel } = message.member.voice;
        if (!channel) {
          //IF AUTHOR IS NOT IN VOICE CHANNEL
          return message.channel.send("YOU NEED TO BE IN VOICE CHANNEL :/");
        }
    
        const serverQueue = message.client.queue.get(message.guild.id);
     if(serverQueue && !serverQueue.playing) {
          serverQueue.playing = true;
          serverQueue.connection.dispatcher.resume()
      let embed = new MessageEmbed()
      .setTitle('Music Resumed')
      .setDescription("✅ | Resumed the Paused Song")
      .setColor('PURPLE')
      return message.channel.send(embed) 
     }
        
        message.channel.send("There is nothing paused that i can resume")
    },
};