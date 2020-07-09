const ytdlDiscord = require("ytdl-core-discord");
const {MessageEmbed} = require("discord.js");

module.exports = {
    async play(song, message) {
        const queue = message.client.queue.get(message.guild.id);
        
        if(!song) {
          queue.channel.leave();
          message.client.queue.delete(message.guild.id)
          return queue.textChannel.send("Music Queue is Ended Now").catch(console.error)
        }
        
        try {
          var stream = await ytdlDiscord(song.url, {
            highWaterMark: 1 << 25,
          });
          
        } catch (error) {
          if(queue) {
            queue.songs.shift()
            module.exports.play(queue.songs[0], message)
          }
          
          if(error.message.includes === "copyright") {
            return message.channel.send("THIS VIDEO CONTAINS COPYRIGHT CONTENT")
          } else {
            console.error(error)
          }
        }
        
        const dispatcher = queue.connection
        .play(stream, {type: "opus"}).on("finish", () => {
          if(queue.loop) {
            let lastsong = queue.songs.shift()
            queue.songs.push(lastsong)
            module.exports.play(queue.songs[0], message)
          } else {
            queue.songs.shift()
            module.exports.play(queue.songs[0], message)
          }
        }).on("error", console.error)
        dispatcher.setVolumeLogarithmic(queue.volume / 100); //VOLUME
        
        
         let embed = new MessageEmbed()
        .setTitle('Playing Now')
        .setColor('PURPLE')
        .setDescription(`**STARTED PLAYING** - 『[${song.title}](${song.url})』[${message.author}]`)
        .setFooter(`Bot by  伊井野 ミコ いいの みこ#4138 || Helped By Shablammo #0188 `)
          queue.textChannel.send(embed)
      }
};