/**
 * Serveur pour l'application permettant d'afficher les wins/loses, le mmr ainsi que le mmr change 
 */
var express = require('express');
var app = express();

// ajout du scrapping
const request = require('request');
const cheerio = require('cheerio');
const profil = "https://rocketleague.tracker.network/rocket-league/profile/steam/76561198351191321/mmr?playlist=11";

app.get('/', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    try {
        request(profil, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(html);

                // récupération du mmr en double ranked
                var statDouble = $('body').find($('.filters')).find($('.summary')).find($('.stat')).next().find($('.value')).html().replace(',', '');

                // envoi du résultat
                res.send(statDouble);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, function() {
    console.log("server is running");
});