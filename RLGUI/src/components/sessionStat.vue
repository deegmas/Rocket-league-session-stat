<template>
    <div id="fenetre">
        <h1 id="mmrActu">MMR : {{mmr}}</h1>
        <hr id="barre">
        <h2 id="wins">{{win}} Wins</h2>
        <h2 id="loses">{{lose}} Loses</h2>
        <h2 id="streak">{{streak}} Streak</h2>
        <h2 id="change">MMR Change : {{mmrChange}}</h2>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            mmr : "", // mmr actuel affiché
            win : 0, // nb de wins
            lose : 0,  // nb de loses
            streak : 0, // streak 
            mmrChange : 0, // mmr +/- 
            mmrDep : 0, // mmr de départ
            mmrMaj : 0, // mmr mis à jour 
            lastMmr : 0, // connaître le mmr d'avant
            lastGame : "", // connaître le status de la derniere game (win/lose)
        }
    },
    mounted() {
        // récupération du mmr actuel et l'affiche au démarrage de l'application
        axios.get('http://127.0.0.1:3000').then(response => this.mmr = response.data)
        // call la fonction de depart
        this.mmrDepart();
    },
    computed: {
        
    },
    methods: {
        // enregistrement du mmr de départ de la session 
        async mmrDepart() {
            // récupération du mmr actuel 
            const mmrDep = await axios.get('http://127.0.0.1:3000')
            // stockage du résultat de la requete dans la constante
            const mmrDebut = mmrDep.data
            // mise à jour de la data mmrDep (de l'affichage)
            this.mmrDep = mmrDebut
            console.log("mmr du début : " + this.mmrDep)
            // enregistrement du dernier mmr
            localStorage.lastMmr = this.mmrDep;
            // enregistrement de la valeur du départ dans le localstorage
            localStorage.mmrDep = this.mmrDep

            // call la fonction de mise à jour du mmr après initialisation (mise à jour toutes les 2 secondes)
            setInterval( () => {
                this.mmrMAJ();
            },2000)

        },
        // appel au serveur toute les 3 secondes pour mettre à jour le mmr actuel et appeller les autres functions si changement de mmr
        async mmrMAJ() {
            // appel au serveur pour récupérer le mmr actuel 
            var result = await axios.get('http://127.0.0.1:3000');
            var mmActuel = result.data;

            // vérification de la taille du mmr pour éviter les erreurs de scrapping
            if (mmActuel.length === 6) {
                // récupération du dernier mmr enregistrer dans le local
                var lastmm = localStorage.lastMmr;
                // vérification si le mmr à changer depuis le début ou non
                if (mmActuel === lastmm) {
                    // aucun changement
                }
                else {
                    // comparaison avec lastmmr et newmmr pour ajouter une wins ou une loses
                    // wins
                    if (mmActuel > lastmm) {
                        // increment wins in the localStorage
                        localStorage.win = localStorage.win + 1;
                        this.win++;

                        if (localStorage.lastGame === "w") {
                            this.streak++;
                        }
                        else {
                            // ajout de win pour le streak
                            localStorage.lastGame = "w";
                            this.streak = 1;
                        }
                    }
                    // loses
                    else if (mmActuel < lastmm ) {
                        // increment loses in the localStorage
                        localStorage.lose = localStorage.lose + 1;
                        // update the frame to show the lose
                        this.lose++;

                        if (localStorage.lastGame === "l") {
                            this.streak--;
                        }
                        else {
                            localStorage.lastGame = "l";
                            this.streak = -1;
                        }
                    }
                    else {
                        // rien (aucun changement)
                    }

                    // calcul de la distance du mmr depuis le début 
                    if ( mmActuel > localStorage.mmrDep ) {

                        // utilisation du replace pour suppression de l'espace entre les chiffres 
                        var mActuelReplace = mmActuel.replace(' ', '');
                        var mActuel = parseInt(mActuelReplace);
                        console.log("mActuel " + mActuel);

                        var mLocalReplace = localStorage.mmrDep.replace(' ','');
                        var mLocal = parseInt(mLocalReplace);
                        console.log("mLocal " + mLocal);

                        this.mmrChange = " + " + (mActuel - mLocal);
                        console.log(mActuel - mLocal);
                    }
                    else if ( mmActuel < localStorage.mmrDep ) {

                        var mActuelLoseReplace = mmActuel.replace(' ','');
                        var mActuelLose = parseInt(mActuelLoseReplace);
                        console.log("mActuelLose " + mActuelLose);

                        var mLocalLoseReplace = localStorage.mmrDep.replace(' ','');
                        var mLocalLose = parseInt(mLocalLoseReplace);
                        console.log("mLocalLose " + mLocalLose);

                        this.mmrChange = " - " + (mActuelLose - mLocalLose);
                        console.log(mActuelLose - mLocalLose);
                    }
                    // actualisation du mmr sur la frame
                    this.mmr = mmActuel;

                    // initialisation du ancien mmr pour l'actuel
                    this.lastMmr = mmActuel;
                    localStorage.lastMmr = mmActuel;
                }
            }
        }
    }
}
</script>

<style>

</style>