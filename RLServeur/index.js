/**
 * Application permattant d'afficher les wins/loses, le mmr ainsi que le mmr change 
 */
var express = require('express');
var app = express();

// ajout du scrapping
const request = require('request');
const cheerio = require('cheerio');
const profil  = 'https://rocketleague.tracker.network/profile/steam/76561198351191321'; // steam "Deegmas"


app.get('/', function(req, res) {
    res.header ('Access-Control-Allow-Origin', '*');
        try {
            request(profil, (error, response, html) => {
                if (!error && response.statusCode == 200) {
                    const $ = cheerio.load(html);
                
                    // récupération du mmr en double ranked
                    const statDouble = $('table tbody tr').next().next().find('td').next().next().next().html().substring(0,6).replace(' ', '').replace(',', ' '); // suppresion du .trim() car suppresion de la dernière valeur
                    
                    // envoi du résultat au serveur
                    console.log("MMR " + statDouble + " taille : " + statDouble.length);
                    res.send(statDouble);
                }
            });
        }catch(error) {
            console.log(error);
    }
});

// démmarage du serveur
app.listen(3000, function() {
    console.log("server is running");
});