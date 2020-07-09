const {play} = require('../../music');
const {API_KEY} = require('../../config');
const ytdl = require('ytdl-core');
const YoutubeAPI = require("simple-youtube-api");
const { MessageEmbed } = require('discord.js');
const youtube = new YoutubeAPI(API_KEY);

module.exports = {
    name: 'play',
    category: 'music',
    description: 'Play Some Audio From Youtube',
    usage: '[link|name]',
    aliases: 'p',
    run: async(client,message,args) => {
        //If There No Link Or Video Name
        if (!args.length) {
            return message.channel.send("WRONG SYNTAX : Type `r=play <URL> or text`");
        }

        const { channel } = message.member.voice;
         //IF AUTHOR IS NOT IN VOICE CHANNEL
        if (!channel) {
          let msg = new MessageEmbed()
          .setDescription("YOU NEED TO BE IN VOICE CHANNEL")
          .setColor('RED')
          return message.channel.send(msg);
        }
        
        const targetsong = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const urlcheck = videoPattern.test(args[0]);


            if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
                 return message.channel.send("PLAYLIST CANNOT BE PLAYED").catch(console.error);
            }
            const serverQueue = message.client.queue.get(message.guild.id);
            const queueConstruct = {
                textChannel: message.channel,
                channel,
                connection: null,
                songs: [],
                loop: false,
                volume: 100,
                playing: true
              };
              let songData = null;
              let song = null;
              if (urlcheck) {
                try {
                  songData = await ytdl.getInfo(args[0]);
                  song = {
                    title: songData.title,
                    url: songData.video_url,
                    duration: songData.length_seconds
                  };
                } catch (error) {
                  if (message.include === "copyright") {
                    return message
                      .reply("THERE IS COPYRIGHT CONTENT IN VIDEO -_-")
                      .catch(console.error);
                  } else {
                    console.error(error);
                  }
                }
              } else {
                try {
                  const result = await youtube.searchVideos(targetsong, 1)
                  songData = await ytdl.getInfo(result[0].url)
                   song = {
                    title: songData.title,
                    url: songData.video_url,
                    duration: songData.length_seconds,
                  };
                } catch (error) {
                  console.error(error)
                }
              }
              if(serverQueue) {
                serverQueue.songs.push(song)
                return serverQueue.textChannel.send(`\`${song.title}\`, Song Added to queue`)
                .catch(console.error)
              } else {
                queueConstruct.songs.push(song);
              }
              
              if(!serverQueue) message.client.queue.set(message.guild.id, queueConstruct)

              if (!serverQueue) {
                try {
                  queueConstruct.connection = await channel.join();
                  play(queueConstruct.songs[0], message);
                } catch (error) {
                  console.error(`Could not join voice channel: ${error}`);
                  message.client.queue.delete(message.guild.id);
                  await channel.leave();
                  return message.channel.send({embed: {"description": `😭 | Could not join the channel: ${error}`, "color": "#ff2050"}}).catch(console.error);
                }
              }          
    },
};