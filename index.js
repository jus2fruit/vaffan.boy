const discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const fs = require("fs")


const adapter = new FileSync('db.json')
const storeadatper = new FileSync('store.json');
const db = low(adapter)
db.defaults({ money: [], Inventory: []}).write()
const storedb = low(storeadatper)
const express = require('express');
const app = express();
const client = new discord.Client();



//DEBUT PARAGRAPHE HEROKU
app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function(){
    console.log(`bot en fonctionnement sur le port ${app.get('port')}`)
})

var bot = new discord.Client();
var prefix = ("/");
var randnum = 0;

bot.on('ready', () => {
    bot.user.setPresence({ game: { name: '╠ [/help] | vaffan bot ╣', type: 0}})
    console.log ("bot ready !")
});

bot.login(process.env.TOKEN);




  bot.on('guildMemberAdd', member => {
    var message = message;
    var joinslog = bot.channels.find("name", "arivee-depart");
    var acceuil = bot.channels.find("name", "acceuil");
    var guild = guild;
    let role = member.guild.roles.find("name", "arrivant");

    if(!joinslog) return logsbot.send(":x: **Erreur:** Aucun channel se nommant **'joins'** a été détécté.");

    console.log(`${member.user.tag} a rejoit`);

    member.addRole(role);
    var bvn_embed = new discord.RichEmbed()
    .setAuthor(`== ! 🙌 BIENVENUE 🙌 ! ==`)
    .setColor("#ADCF4F")
    .setDescription(`**${member.user.tag}** Amuse-toi bien parmis nous ! N'oublie pas d'aller lire les regles dans ${acceuil}\n\nSoyez polis, Souhaitez tous la bienvenue à notre nouvel arrivant ! Avec /bvn`)
    .setThumbnail(`${member.user.displayAvatarURL}`)
    .setTimestamp()
    .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL}`);
    joinslog.send(bvn_embed);

});

bot.on('guildMemberRemove', member => {
    var message = message;
    var joinslog = bot.channels.find("name", "arivee-depart");

    if(!joinslog) return logsbot.send(":x: **Erreur:** Aucun channel se nommant " + `**"${joinslog}"**` + " a été détécté.");

    console.log(member.user.username + ' a quitté le serveur');
    var depart_embed = new discord.RichEmbed()
    .setAuthor(`== ! 😥 DÉPART 😥 ! ==`)
    .setColor("#C03000")
    .setDescription(`**${member.user.tag}** nous a quitté.\n\nNous te souhaitons tous bonne chance pour la suite.`)
    .setThumbnail(`${member.user.displayAvatarURL}`)
    .setTimestamp()
    .setFooter(`${bot.user.username}`, `${bot.user.displayAvatarURL}`);
    joinslog.send(depart_embed);

});



  
bot.on ('message' , message => { 
    


    var args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLowerCase();
   

    if (message.content === "ping"){
        message.reply(`:ping_pong:  pong !`);
        console.log('ping pong !');

    }
    if (message.content === "bonne nuit"){
        message.reply("bonne nuit à toi")
        console.log('bonne nuit')
    }
    if (message.content === "Bonne nuit"){
         message.reply("bonne nuit à toi")
         console.log('bonne nuit')
    }
    if (message.content === "test"){
        message.reply("tu test quoi la !!!")
        console.log('test')
    }
    if (message.content === "bonjour"){
        message.reply("bonjour!")
        console.log('bonjour')
    }

    if (message.content === "Bonjour"){
        message.reply("bonjour!")
        console.log('bonjour')
    }

    if (message.content === "bonsoir"){
        message.reply("bonsoir!")
        console.log('bonsoir')
    }

    if (message.content === "Bonsoir"){
        message.reply("bonsoir!")
        console.log('bonsoir')
    }

    if (message.content === "ça va vaffan bot"){
        message.reply("oui, merci de te soucier de moi")
        console.log('sa va')
    }

     
    var msgauthor = message.author.id;

    if (message.author.bot)return;

    if (!db.get("Inventory").find({user: msgauthor}).value()){
         db.get("Inventory").push({user: msgauthor, items: "Vide"}).write();
     }

    if (!db.get("money").find({user: msgauthor}).value()){
        db.get("money").push({user: msgauthor, money: 1}).write();
     }else{
         var usermoneydb = db.get("money").filter({user: msgauthor}).find("money").value();
         console.log("usermoneydb");
         var usermoney = Object.values(usermoneydb)
         console.log(usermoney);
         console.log(`nombre de money : ${usermoney[1]}`)

         db.get("money").find({user: msgauthor}).assign({user: msgauthor, money: usermoney[1] += 1}).write();

     }

     if (!message.content.startsWith(prefix)) return;
     var args = message.content.substring(prefix.length).split(" ");

     switch (args[0].toLowerCase()){
         
        case "store":
        var store_embed = new discord.RichEmbed()
            .setColor('#E20000')
            .setTitle("vaffan store")
            .setDescription("voici le store !")
            .addField("couleur:", "rouge [100money][ID: item0001] description: pseudo rouge")
            .addField("couleur:", "bleu [150money][ID: item0002] description: pseudo bleu")
            .addField("couleur:", "aux choix [500money][ID: item0003] description: couleur pseudo aux choix")
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)

        message.channel.send({embed: store_embed});
        console.log("store");

        break;

        case "buyitem":

        var itembuying = message.content.substr(9);
        if (!itembuying){
            itembuying = "Indeterminé !";
        }else{
            console.log(`StoreLogs: demande d'achat d'item ${itembuying}`)
            if (storedb.get("store_items").find({itemID: itembuying}).value()){
                console.log("Item trouvée")
                var info = storedb.get("store_items").filter({itemID: itembuying}).find("name", "desc").value();
                var iteminfo = Object.values(info);
                console.log(iteminfo);
                var buy_embed = new discord.RichEmbed()
                    .setTitle("vaffan store - facture d'achat")
                    .setDescription("attention ceci est une facture d'achat ! merci de votre achat")
                    .addField("Infos", `*ID:* ***${iteminfo[0]}***\n*Nom:* ***${iteminfo[1]}***\n*Description:* ***${iteminfo[2]}***\n*prix:* ***${iteminfo[3]}***`)
                
                message.author.send({embed: buy_embed});

                var useritem = db.get("Inventory").filter({user: msgauthor}).find("items").value();
                var itemsdb = Object.values(useritem);
                var usermoneydb = db.get("money").filter({user: msgauthor}).find("money").value();
                var usermoney = Object.values(usermoneydb);

                if (usermoney[1] >= iteminfo[3]){
                    message.reply(`***information:*** votre achat (${iteminfo[1]}) a été accépté. retrait de ${iteminfo[3]} money`)
                if (!db.get("Inventory").filter({user: msgauthor}).find({user: "Vide"}).value()){
                    console.log("inventaire pas vide");
                    db.get("money").filter({user: msgauthor}).find("money").assign({user: msgauthor, money: usermoney[1] -= iteminfo[3]}).write();
                    db.get("Inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: itemsdb[1] + " , " + iteminfo[1]}).write();
                }else{
                    console.log("inventaire vide !");
                    db.get("money").filter({user: msgauthor}).find("money").assign({user: msgauthor, money: usermoney[1] -= iteminfo[3]}).write();
                    db.get("Inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: iteminfo[1]}).write();
                    }
                }else{
                    message.reply("erreur de transactions! nombre de money insufisant !");

                }
            }
        }

     break;

        case "stats":

        var usemoneydb = db.get("money").filter({user: msgauthor}).find("money").value();
        var usermoney = Object.values(usermoneydb);
        var Inventorydb = db.get("Inventory").filter({user: msgauthor}).find("items").value();
        var Inventory = Object.values(Inventorydb);
        var usercreatedate = message.author.createdAt.toString().split(' ')

         var stats_embed = new discord.RichEmbed()
         .setColor('#01FF3E')
         .setTitle(`stats utilisateur :`)
         .addField("nom de l'utilisateur", message.author.username)
         .addField("money",`${usermoney[1]} money`, true)
         .addField("user ID", msgauthor, true)
         .addField("inventaire", Inventory[1])
         .setThumbnail(message.author.avatarURL)
         .addField("date de création de l'utilisateur", usercreatedate[1] + ' ' + usercreatedate[2]+','+usercreatedate[3])
         .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)

         message.channel.send({embed: stats_embed})

        break;

        case "statsde":

        var msgmention = message.mentions.members.first().id;
        var msgnom = message.mentions.members.first();
        var usermoneydb = db.get("money").filter({user: msgmention}).find("money").value();
        var usermoney = Object.values(usermoneydb);
        var Inventorydb = db.get("Inventory").filter({user: msgmention}).find("items").value();
        var Inventory = Object.values(Inventorydb);
        var usercreatedate = message.mentions.members.first().user.createdAt.toString().split(' ')
        

         var statsde_embed = new discord.RichEmbed()
         .setColor('#01FF3E')
         .setTitle(`stats utilisateur :`)
         .addField("nom de l'utilisateur", msgnom)
         .addField("money",`${usermoney[1]} money`, true)
         .addField("user ID", msgmention, true)
         .addField("inventaire", Inventory[1])
         .setThumbnail(message.mentions.members.first().user.avatarURL)
         .addField("date de création de l'utilisateur", usercreatedate[1] + ' ' + usercreatedate[2]+','+usercreatedate[3])
         .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
         

         message.channel.send({embed: statsde_embed})

        break;

        case "inv":

         var Inventorydb = db.get("Inventory").filter({user: msgauthor}).find("items").value();
         var Inventory = Object.values(Inventorydb);

         var inv_embed = new discord.RichEmbed()
         .setColor('#04GF5E')
         .addField("inventaire", Inventory[1])
         .addField("nom de l'utilisateur", message.author.username)
         .addField("user ID", msgauthor, true)
         .setThumbnail(message.author.avatarURL)
         .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)

         message.channel.send({embed: inv_embed})

        break;

        case "invde":

        var msgmention = message.mentions.members.first().id;
        var msgnom = message.mentions.members.first();
        var Inventorydb = db.get("Inventory").filter({user: msgmention}).find("items").value();
        var Inventory = Object.values(Inventorydb);

        var invde_embed = new discord.RichEmbed()
        .setColor('#04GF5E')
        .addField("inventaire", Inventory[1])
        .addField("nom de l'utilisateur", msgnom)
        .addField("user ID", msgmention, true)
        .setThumbnail(message.mentions.members.first().user.avatarURL)
        .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)

        message.channel.send({embed: invde_embed})

       break;

       case "logode":

       var msgnom = message.mentions.members.first();

        var logode_embed = new discord.RichEmbed()
        .setColor('#25c059')
        .addField(`**Voici le logo de**`, msgnom)
        .setImage(message.mentions.members.first().user.avatarURL)
        .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
        message.channel.send(logode_embed)

       break;

     }

    if (message.content === prefix + "help"){
        var help_embed = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("commande du bot !", "https://vaffansquad.wixsite.com/vaffan-squad/vaffan-bot")
           .addField("commande moderateur:", "https://vaffansquad.wixsite.com/vaffan-squad/commande-moderateur" )
           .addField("enderbot commande:", "https://vaffansquad.wixsite.com/vaffan-squad/enderbot")
           .addField("dyno commande:", "https://vaffansquad.wixsite.com/vaffan-squad/dyno")
           .addField("Mee6 commande:", "https://vaffansquad.wixsite.com/vaffan-squad/Mee6")
           .addField("koya commande:", "https://vaffansquad.wixsite.com/vaffan-squad/koya")
           .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
           message.channel.send(help_embed);

    }

    if (message.content === prefix + "logobot"){
        var logobot_embed = new discord.RichEmbed()
        .setColor('#25c059')
        .setTitle("**Voici le logo du bot**")
        .setImage(bot.user.avatarURL)
        .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
        message.channel.send(logobot_embed)

    }

    if (message.content === prefix + "logo"){
        var logobot_embed = new discord.RichEmbed()
        .setColor('#25c059')
        .setTitle(`**Voici ton logo**`)
        .setImage(message.author.avatarURL)
        .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
        message.channel.send(logobot_embed)

    }

    if (message.content === prefix + "helpmp"){
        message.reply("help envoyés")
        var helpmp_embed = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("commande du bot !", "https://vaffansquad.wixsite.com/vaffan-squad/vaffan-bot")
           .addField("commande moderateur:", "https://vaffansquad.wixsite.com/vaffan-squad/commande-moderateur" )
           .addField("enderbot commande:", "https://vaffansquad.wixsite.com/vaffan-squad/enderbot")
           .addField("dyno commande:", "https://vaffansquad.wixsite.com/vaffan-squad/dyno")
           .addField("Mee6 commande:", "https://vaffansquad.wixsite.com/vaffan-squad/Mee6")
           .addField("koya commande:", "https://vaffansquad.wixsite.com/vaffan-squad/koya")
           .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
           message.author.send(helpmp_embed);
    }

    if (message.content === prefix + "money"){
       var money = db.get("money").filter({user: msgauthor}).find('money').value()
       var moneyfinal = Object.values(money);
       var money_embed = new discord.RichEmbed()
         .setColor('#01FF3E')
         .setTitle(`money de ${message.member.user.username}`)
         .setDescription("voici ta money")
         .addField("money:", `${moneyfinal[1]} money` )
         .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
    message.channel.send({embed: money_embed});
    }

    if (message.content === prefix + "insult"){
        message.author.send("tu veut m'insulter c'est sa !!!!")
        console.log('insult')
    }

    if (message.content === prefix + "site"){
        message.author.send("https://vaffansquad.wixsite.com/vaffan-squad")
        console.log('site')
    }


    if ( command === "slap" ){
        if (message.mentions.users.size === 0) {
            return message.reply("mentionne quelqu'un stp")
            console.log("fail slap") 
        }
        console.log("Commande slap")
        random2(1, 10)
        let slap = message.mentions.members.first().user.username

        if (randnum2 == 1){
            var slap_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/v0tBeMcKMdpUQ/giphy.gif`) 
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap_embed) 
        }
    
        if (randnum2 == 2){
            var slap2_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/26tk1gJXh1HlWn064/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap2_embed)
    
        }

        if (randnum2 == 3){
            var slap3_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`http://www.giflords.com/wp-content/uploads/2017/05/g3hh.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap3_embed)
    
        }

        if (randnum2 == 4){
            var slap4_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media1.tenor.com/images/8a47ca4d5e354e3e5cc9f61139971b98/tenor.gif?itemid=4703409`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap4_embed)
    
        }

        if (randnum2 == 5){
            var slap5_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://vignette.wikia.nocookie.net/onepunchman/images/7/7a/Encha%C3%AEnement_de_Coups_de_Poings_Normaux.gif/revision/latest?cb=20160301165218&path-prefix=fr`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap5_embed)
    
        }

        if (randnum2 == 6){
            var slap6_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/arbHBoiUWUgmc/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap6_embed)
    
        }

        if (randnum2 == 7){
            var slap7_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/XfuZlqRsgSRJS/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap7_embed)
    
        }

        if (randnum2 == 8){
            var slap8_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/11txOp944ZY04o/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap8_embed)
    
        }

        if (randnum2 == 9){
            var slap9_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/nQaMApy6YJTTW/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap9_embed)
    
        }

        if (randnum2 == 10){
            var slap10_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous avez claqué **" + slap +".", "Aie j'aurai pas aimer !")
            .setImage(`https://media.giphy.com/media/rP25O9Dy6W9dC/giphy.gif`)
            .setFooter("merci d'utiliser le vaffan bot", bot.user.avatarURL)
            message.channel.send(slap10_embed)
    
        }
     
    }


     if ( command === "hug" ){  
        if (message.mentions.users.size === 0) {
            return message.reply("mentionne quelqu'un stp")
            console.log("fail hug") 
        }
        
        console.log("Commande hug")
        random2(1, 10);


        if (randnum2 == 1){
            var hug_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/IuCSOHcDlooPm/giphy.gif`) 
            message.channel.send(hug_embed) 
        }
    
        if (randnum2 == 2){
            var hug2_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/yidUzriaAGJbsxt58k/giphy.gif`)
            message.channel.send(hug2_embed)
    
        }

        if (randnum2 == 3){
            var hug3_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`http://media.giphy.com/media/42YlR8u9gV5Cw/giphy.gif`)
            message.channel.send(hug3_embed)
    
        }

        if (randnum2 == 4){
            var hug4_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/lXiRKBj0SAA0EWvbG/giphy.gif`)
            message.channel.send(hug4_embed)
    
        }

        if (randnum2 == 5){
            var hug5_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/fyx8vjZc2ZvoY/giphy.gif`)
            message.channel.send(hug5_embed)
    
        }

        if (randnum2 == 6){
            var hug6_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/Qwi6fEcn2JJeg/giphy.gif`)
            message.channel.send(hug6_embed)
    
        }

        if (randnum2 == 7){
            var hug7_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/X4pI9XchDNsu4/giphy.gif`)
            message.channel.send(hug7_embed)
    
        }

        if (randnum2 == 8){
            var hug8_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/BnhIfw9hBDlLi/giphy.gif`)
            message.channel.send(hug8_embed)
    
        }

        if (randnum2 == 9){
            var hug9_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/wsSssszJkPBYs/giphy.gif`)
            message.channel.send(hug9_embed)
    
        }

        if (randnum2 == 10){
            var hug10_embed = new discord.RichEmbed()
            .setColor('#F60000')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(`https://media.giphy.com/media/mmPgxbuPiwCQg/giphy.gif`)
            message.channel.send(hug10_embed)
    
        }

        if (randnum2 == 11){
            var hug6_embed = new discord.RichEmbed()
            .setColor('#25c059')
            .addField("**Vous fait un calin à **" + hug +".", "j'éspére qu'il(elle) à aimer !")
            .setImage(``)
            message.channel.send(hug6_embed)
    
        }

    }

})


function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(3);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}
function random2(min, max){
    min2 = Math.ceil(min)
    max2 = Math.floor(max)
    randnum2 = Math.floor(Math.random() * (max2 - min2 +1) + min2)
}

let XP = JSON.parse(fs.readFileSync('./xp.json', 'utf8'));

bot.on("message", message => {
if(message.content.startsWith("prefix")) return;
if(message.author.bot) return;
if(!XP[message.author.id]) XP[message.author.id] = {XP: 0, level: 0};
let userData = XP[message.author.id];
userData.XP++;
let curLevel = Math.floor(0.1 * Math.sqrt(userData.XP));
if(curLevel > userData.level) {
userData.level = curLevel;
message.reply(`Vous êtes désormais au niveau **${curLevel}**!`);
}
if(message.content.startsWith("/level")) {

var level_embed = new discord.RichEmbed()
.setColor('#E20000')
.setAuthor("Voici vos statistiques", (message.author.avatarURL))
.addField("Niveaux:", `${userData.level}`, true)
.addField("XP:", `${userData.XP}`, true)
.setTimestamp()

message.channel.send({embed: level_embed});
}
fs.writeFile('./xp.json', JSON.stringify(XP), (err) => {if(err) console.error(err)});
});



bot.on('message', message => {
    if (message.content.startsWith("/piece")) {
 var commande = [":moneybag: | La pièce dit : Face.", ":moneybag: | La pièce dit : Pile."]
      message.channel.send(`${(commande[Math.floor(Math.random() * commande.length)])}`)
 }
 
 });


 bot.on('message', message => {
    if (message.content.startsWith("/roll")) {
 var commande = [":control_knobs: | Vous etes tombé sur le numero: 1",":control_knobs: | Vous etes tombé sur le numero: 2",":control_knobs: | Vous etes tombé sur le numero: 3",":control_knobs: | Vous etes tombé sur le numero: 4",":control_knobs: | Vous etes tombé sur le numero: 5",":control_knobs: | Vous etes tombé sur le numero: 6",":control_knobs: | Vous etes tombé sur le numero: 7",":control_knobs: | Vous etes tombé sur le numero: 8",":control_knobs: | Vous etes tombé sur le numero: 9",":control_knobs: | Vous etes tombé sur le numero: 10"]
      message.channel.send(`${(commande[Math.floor(Math.random() * commande.length)])}`)
 }
 });


 bot.on('message', message => {
    if (message.content.startsWith("/bvn")) {
       message.delete(1000);
       message.channel.send(":tada: | **" + message.author.username + "** vous souhaite la bienvenue !");
    }
 });
 
 
 
 bot.on('message', message => {
    if (message.content.startsWith("/salut")) {
       message.delete(1000);
       message.channel.send(":wave: | **" + message.author.username + "** vous fait un coucou !");
    }
 });

 bot.on("message", message => {

	
	if (!message.content.startsWith(prefix)) return;
	let command = message.content.split(" ")[0].slice(prefix.length)
    let params = message.content.split(" ").slice(1) 
    var args = message.content.substring(prefix.length).split(" ");


let clear = require(`./command/clear.js`) 
let mute = require(`./Command/mute.js`)

if (command === "clear"){
    clear.exec(bot,message,params)
}

if (command === "mute") {
	mute.exec(bot,message,params)
}

 })





