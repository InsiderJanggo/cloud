const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'queue',
    description: 'get list of added songs',
    usage: '[queue]',
    category: 'music',
    run: (client,message,args) => {
        const { channel } = message.member.voice;
        //IF AUTHOR IS NOT IN VOICE CHANNEL
        if (!channel) {
          return message.channel.send("YOU NEED TO BE IN VOICE CHANNEL");
        }
         const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) {
      return message.channel.send("There is nothing in the queue");
    }
    let queueEmbed = new MessageEmbed()
    .setTitle('Queue List')
    .setColor('PURPLE')
    .setDescription( `${serverQueue.songs
      .map((song, index) => index + 1 + ". " + song.title)
      .join("\n\n")}`,
    { split: true }
    )
       message.channel.send(
          queueEmbed
       );
    }
}