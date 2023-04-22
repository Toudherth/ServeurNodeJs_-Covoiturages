var express = require("express");
const req = require("express/lib/request");
var app= express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});
var MongoClient= require("mongodb").MongoClient;
var url="mongodb://127.0.0.1:27017";
app.listen(8888);
console.log("Serveur demarré");

const client = new MongoClient(url);


async function main(){
    console.log("OK");
    client.connect()
    .then(
        client => {
            db=  client.db("SERVERCOVOITURAGES"); 


            // authentification 
            app.post("/user/connexion", async (req,res) => {
                console.log("/user/connexion avec ", req.body);
                let document = await db.collection("internautes").find(req.body).toArray();
                if (document.length == 1)
                    res.json({"resultat": 1, "message": "Authentification réussie"});
                else res.json({"resultat": 0, "message": "Email et/ou mot de passe incorrect"});
            }); 

        // Fonctionnalité 1
        // Ajouter Internaute    
        app.post("/internautes/add", async (req,res) => {
            console.log("/internaute/add avec ", req.body);
            try{
                const document = await db.collection("internautes").insertOne(req.body); //.toArray();
                res.status(200).json(document);
            }catch (error){
                console.error(error);
                res.status(500).json(error);
            }
        });

        // Fonctionnalité 2
        // Ajouter covoiturage   
        app.post("/covoiturages/add", async (req,res) => {
            console.log("/covoiturages/add avec ", req.body);
            try{
            let document = await db.collection("covoiturages").insertOne(req.body); //.toArray();
                res.status(200).json(document);
            }catch (error){
                console.error(error);
                res.status(500).json(error);
            }
        });
          // Fonctionnalité 3 :
          // Recherche par ville de depart et d'arriver  et date selectionner et aussi le prix moyen de trajet !! 
          // la il reste le prix nest pas encours ajouter   
          app.get("/covoiturage/:villedepart/:villearrive/:datejour", async (req, res) =>{
            console.log("/covoiturages/"+req.params.villedepart+" - " +req.params.villearrive + " pour le : "+req.params.datejour);
            let documents = await db.collection("covoiturages").find({villedepart:req.params.villedepart, villearrive: req.params.villearrive , datejour: req.params.datejour}).toArray();
            res.json(documents);
        });

        // recherceh par ville de depart 
        app.get("/covoiturages/:villedepart", async (req, res) =>{
            console.log("/covoiturages/"+req.params.villedepart);
            let documents = await db.collection("covoiturages").find({villedepart:req.params.villedepart}).toArray();
            res.json(documents);
        });
      

        //Fonctionnalité 4 :
        // Selectionnée Covoiturage et rajouter dans transport 

        app.post("/trasport/add", async(req, res)=>{
            console.log("/transport/add", req.body);
            try{
                const document = await db.collection("transports").insertOne(req.body);  // ajouter transport a partir de la selection d'un covoiturage 
            }catch(error){
                console.error(error);
            }
        });





        /* -------------------  Des methodes qui ont pas relation avec le projet ------------------- */

         // Afficher les covoiturages existant
        app.get("/internautes", async (req, res) => {
            console.log("/internautes/");
            let documents = await db.collection("internautes").find().toArray();
            res.json(documents);
        });
        
            // Afficher les covoiturages existant
        app.get("/covoiturages", async (req, res) => {
            console.log("/covoiturages/");
            let documents = await db.collection("covoiturages").find().toArray();
            res.json(documents);
        });

        app.get("/internautes/:nom/:prenom", async (req, res) => {
            console.log("/internautes/" + req.params.nom + "/" + req.params.prenom);
            let documents = await db.collection("internautes").find({nom: req.params.nom, prenom: req.params.prenom}).toArray();
            res.json(documents);
        });

        app.get("/internautes/:nom", async (req, res) =>{
            console.log("/internautes/"+req.params.nom);
            let documents = await db.collection("internautes").find({nom:req.params.nom}).toArray();
            res.json(documents);
        });
      
        // http://127.0.0.1:8888/email/covoiturages
        app.get("/email/covoiturages", async (req,res) => {
			console.log("/email/covoiturages");
			covoiturages = [];
			let documents = await db.collection("covoiturages").find().toArray();
			for (let doc of documents) {
				if (!covoiturages.includes(doc.email)) covoiturages.push(doc.email); 
			}
			res.json(covoiturages);
		});

        
        //// collection internautes 

        app.get("/internautes", async (req, res) => {
            console.log("/internautes/");
            let documents = await db.collection("internautes").find().toArray();
            res.json(documents);
        });

       
    });
}
main();   // il faut faire appel a la fonction main 