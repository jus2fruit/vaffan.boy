exports.exec = (bot,message,params) => {

if (message.member.hasPermission('MANAGE_MESSAGES')) {

        let args = message.content.split(" ").slice(1);
         let messagecount = parseInt(args.join(' '));

          message.channel.fetchMessages({limit: `${isNaN(messagecount) ? 100 : messagecount }`}).then(messages => { message.channel.bulkDelete(messages,true).then()})
              message.delete(message.author);
            }else{ 
                if (message.member.hasPermission('EMBED_LINKS')) {
                  let embed = new bot.discord.RichEmbed()
                  .setColor(16711680)
                  .setDescription("tu na pas les perm pour fair un clear")
                  message.channel.send({embed})
        } else {
            message.channel.send("```tu na pas les perm pour fair un clear```") }
            }console.log(`commande clear utilisée sur ${message.guild.name}`)  

        }