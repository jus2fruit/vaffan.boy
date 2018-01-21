const discord = require('discord.js');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const storeadatper = new FileSync('store.json');
const db = low(adapter)
db.defaults({ point: [], Inventory: []}).write()
const storedb = low(storeadatper)
const express = require('express');
const app = express();

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

bot.on ('message' , message => {
    if (message.content === "ping"){
        message.reply(":ping_pong:  pong !");
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


    var msgauthor = message.author.id;

    if (message.author.bot)return;

    if (!db.get("Inventory").find({user: msgauthor}).value()){
         db.get("Inventory").push({user: msgauthor, items: "Vide"}).write();
     }

    if (!db.get("point").find({user: msgauthor}).value()){
        db.get("point").push({user: msgauthor, point: 1}).write();
     }else{
         var userpointdb = db.get("point").filter({user: msgauthor}).find("point").value();
         console.log("userpointdb");
         var userpoint = Object.values(userpointdb)
         console.log(userpoint);
         console.log(`nombre de point : ${userpoint[1]}`)

         db.get("point").find({user: msgauthor}).assign({user: msgauthor, point: userpoint[1] += 1}).write();

     }

     if (!message.content.startsWith(prefix)) return;
     var args = message.content.substring(prefix.length).split(" ");

     switch (args[0].toLowerCase()){
         
        case "store":
        var store_embed = new discord.RichEmbed()
            .setColor('#E20000')
            .setTitle("vaffan store")
            .setDescription("voici le store !")
            .addField("couleur:", "rouge [100point][ID: item0001] description: pseudo rouge")
            .addField("couleur:", "bleu [150point][ID: item0002] description: pseudo bleu")
            .addField("couleur:", "aux choix [500point][ID: item0003] description: couleur pseudo aux choix")

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
                var userpointdb = db.get("point").filter({user: msgauthor}).find("point").value();
                var userpoint = Object.values(userpointdb);

                if (userpoint[1] >= iteminfo[3]){
                    message.reply(`***information:*** votre achat (${iteminfo[1]}) a été accépté. retrait de ${iteminfo[3]} point`)
                if (!db.get("Inventory").filter({user: msgauthor}).find({user: "Vide"}).value()){
                    console.log("inventaire pas vide");
                    db.get("point").filter({user: msgauthor}).find("point").assign({user: msgauthor, point: userpoint[1] -= iteminfo[3]}).write();
                    db.get("Inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: itemsdb[1] + " , " + iteminfo[1]}).write();
                }else{
                    console.log("inventaire vide !");
                    db.get("point").filter({user: msgauthor}).find("point").assign({user: msgauthor, point: userpoint[1] -= iteminfo[3]}).write();
                    db.get("Inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: iteminfo[1]}).write();
                    }
                }else{
                    message.reply("erreur de transactions! nombre de point insufisant !");

                }
            }
        }

     break;

        case "stats":

        var userpointdb = db.get("point").filter({user: msgauthor}).find("point").value();
        var userpoint = Object.values(userpointdb);
        var Inventorydb = db.get("Inventory").filter({user: msgauthor}).find("items").value();
        var Inventory = Object.values(Inventorydb);
        var usercreatedate = message.author.createdAt.toString().split(' ')

         var stats_embed = new discord.RichEmbed()
         .setColor('#01FF3E')
         .setTitle(`stats utilisateur : ${message.author.username}`)
         .addField("point",`${userpoint[1]} point`, true)
         .addField("user ID", msgauthor, true)
         .addField("inventaire", Inventory[1])
         .addField("date de création de l'utilisateur", usercreatedate[1] + ' ' + usercreatedate[2]+','+usercreatedate[3])
         .setThumbnail(message.author.avatarURL)

         message.channel.send({embed: stats_embed})

        break;

     }


    if (message.content === prefix + "help"){
        var help_embed = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("commande du bot !", "   /help : affiche les commande du bot ! \n/point : vous dit votre nombre de point\n/helpmp : vous donne le help en mp\n/store : pour voir notre boutique\n/buyitem (item001)\n/stats : pour voir vos stats et votre inventaire\n/insult ésseye et tu verra")
           .addField("interaction",  "ping : vous dit vos ping \nbonne nuit : vous dit bonne nuit \nbonjour : vous dit bonjour etc... ")
           .addField("commande moderateur:", "^^warn : @lepseudo laraison \n^^warns @lepseudo : vous dit les warn de la perssone \n^^mute le temps @lepseudo \n!clear le nombre de message \ntout sa est à faire dans le channel #sanction " )
           .addField("enderbot commande:", ">i : ouvre l'inventaire ou crée votre conte\n>mine : mine pour 1 de mana\n>mineall : mine pour toute la mana\> ")
           message.channel.sendEmbed(help_embed);
           var help_embed2 = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("UnbelievaBoat", "$bank: Vérifiez le solde total de la banque pour le serveur et le taux d'intérêt actuel.\n$deposit <amount ou all>: Déposez de l'argent à votre banque.\n$withdraw <amount ou all>: Retirez de l'argent de votre banque.\n$give-money <member> <amount>: Donnez à un autre membre votre argent\n$money [member]: Vérifiez votre solde, ou le solde d'un autre membre.\n$leaderboard [page]: Affiche le classement de l'argent pour le serveur.\n$work: Travailler. Cette commande n'a aucune chance d'obtenir une amende.Et permet de travailler.\n$slut: vous faitent juste la s*lope pour de l'argent.\n$crime: Commettre un crime, cela a plus de risque, mais un paiement plus élevé.\n$rob <member>: vole l'argent d'un autre membre!")
           .addField("UnbelievaBoat suite", "$store: pour voir le store\n$buy-item [quantity] <item name> : Achetez un article du magasin. Si aucune quantité n'est donnée, vous allez acheter 1.\n$sell-item <member> [quantity] <name>: Vendre un article dans votre inventaire à un autre membre pour de l'argent.\n$use-item [amount] <item name>: Utilisez un article dans votre inventaire. Si l'élément est associé à un rôle, ce rôle vous sera attribué.\n$inventory [member] [page] Voir votre l'inventaire ou celui de quelqu'un d'autre\n$item-info <item name>: Afficher les détails d'un article")
           message.channel.sendEmbed(help_embed2);
        console.log("commande help demander !");
    }

    if (message.content === prefix + "helpmp"){
        message.reply("help envoyés")
        var helpmp_embed = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("commande du bot !", "   /help : affiche les commande du bot ! \n/point : vous dit votre nombre de point\n/helpmp : vous donne le help en mp\n/store : pour voir notre boutique\n/buyitem (item001)\n/stats : pour voir vos stats et votre inventaire\n/insult ésseye et tu verra")
           .addField("interaction",  "ping : vous dit vos ping \nbonne nuit : vous dit bonne nuit \nbonjour : vous dit bonjour ")
           .addField("commande moderateur:", "^^warn : @lepseudo laraison \n^^warns @lepseudo : vous dit les warn de la perssone \n^^mute le temps @lepseudo \n!clear le nombre de message \ntout sa est à faire dans le channel #sanction " )
           .addField("enderbot commande:", ">i : ouvre l'inventaire ou crée votre conte\n>mine : mine pour 1 de mana\n>mineall : mine pour toute la mana\> ")
           message.author.sendEmbed(helpmp_embed);
           var help_embed2 = new discord.RichEmbed()
           .setColor('#0132BC')
           .addField("UnbelievaBoat", "$bank: Vérifiez le solde total de la banque pour le serveur et le taux d'intérêt actuel.\n$deposit <amount ou all>: Déposez de l'argent à votre banque.\n$withdraw <amount ou all>: Retirez de l'argent de votre banque.\n$give-money <member> <amount>: Donnez à un autre membre votre argent\n$money [member]: Vérifiez votre solde, ou le solde d'un autre membre.\n$leaderboard [page]: Affiche le classement de l'argent pour le serveur.\n$work: Travailler. Cette commande n'a aucune chance d'obtenir une amende.Et permet de travailler.\n$slut: vous faitent juste la s*lope pour de l'argent.\n$crime: Commettre un crime, cela a plus de risque, mais un paiement plus élevé.\n$rob <member>: vole l'argent d'un autre membre!")
           .addField("UnbelievaBoat suite", "$store: pour voir le store\n$buy-item [quantity] <item name> : Achetez un article du magasin. Si aucune quantité n'est donnée, vous allez acheter 1.\n$sell-item <member> [quantity] <name>: Vendre un article dans votre inventaire à un autre membre pour de l'argent.\n$use-item [amount] <item name>: Utilisez un article dans votre inventaire. Si l'élément est associé à un rôle, ce rôle vous sera attribué.\n$inventory [member] [page] Voir votre l'inventaire ou celui de quelqu'un d'autre\n$item-info <item name>: Afficher les détails d'un article")
           message.author.sendEmbed(help_embed2);
        console.log("commande helpmp demander !");
    }

    if (message.content === prefix + "point"){
       var point = db.get("point").filter({user: msgauthor}).find('point').value()
       var pointfinal = Object.values(point);
       var point_embed = new discord.RichEmbed()
         .setColor('#01FF3E')
         .setTitle(`point de ${message.author}`)
         .setDescription("voici tes points")
         .addField("point:", `${pointfinal[1]} point` )
    message.channel.send({embed: point_embed});
    }

    if (message.content === prefix + "insult"){
        message.author.send("tu veut m'insulter c'est sa !!!!")
        console.log('insult')
    }

});
