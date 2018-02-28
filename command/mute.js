exports.exec = (bot,message,params) => {
    if(!message.member.hasPermission("MANAGE_ROLES")){
        return message.reply("tu na pas les permissions pour mute")
    }
     if (message.mentions.users.size === 0) {
        return message.reply("mentionne quelqu'un à mute/unmute")
    }
    if (!message.guild.member(bot.user).hasPermission("BAN_MEMBERS")) {
   return message.reply("tu na pas les permissions pour mute")
    } 
    
    let mutedRole = message.guild.roles.find('name', 'muted')
    let member = message.guild.member(message.mentions.users.first())
    
    if(!member.roles.find('name','muted')){
        member.addRole(mutedRole.id).then(addRole => message.channel.send(`l'utilisateur ${params[0]} est maintenant mute`)).catch(console.err)
        console.log(`The user "${message.mentions.users.first().username}" has been muted from the server ${message.guild.name}`)
    }else{
        member.removeRole(mutedRole.id).then(removeRole => message.channel.send(`l'utilisateur ${params[0]} est maintenant unmute`)).catch(console.err)
        console.log(`The user "${message.mentions.users.first().username}" has been unmuted from the server ${message.guild.name}`)
    }  
}
