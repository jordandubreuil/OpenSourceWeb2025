const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const {isAuthenticated} = require("./auth"); //Import our Authentcation routes

//CRUD router examples Connection to databas route examples below

//get route to get data from database
router.get("/games", async (req,res)=>{
    try{
        const games = await Game.find();
        res.json(games);
    }catch(err){
        res.status(500).json({error:"Failed to fetch game data"});
    }
});

//get route for a single user
router.get("/games/:id", async (req,res)=>{
    try{
        const game = await Game.findById(req.params.id);
        if(!game){
            return res.status(404).json({error:"Game not found"});
        }
        res.json(game);

    }catch(err){
        res.status(500).json({error:"Failed to fetch game"});
    }
});

//post route to add data
router.post("/addgame", async (req,res)=>{
    console.log(req.body.gamename);
    try{
        const newGame = new Game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
        console.log(savedGame);
    }catch(err){
        router.put("/users/:id", async (req, res) => {
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                if (!updatedUser) {
                    return res.status(404).json({ error: "User not found" });
                }
                res.json(updatedUser);
            } catch (err) {
                res.status(400).json({ error: "Failed to update user" });
            }
        });
    }
});

//put route to update data
router.put("/updategame/:id", (req,res)=>{
    //example using a promise statement
    Game.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true
    }).then((updatedgame)=>{
        if(!updatedgame){
            return res.status(404).json({ error: "game not found" });    
        }
        res.json(updatedgame);
    }).catch((err)=>{
        res.status(400).json({ error: "Failed to update the game" });
    });
});

//Example of delete route
router.delete("/deletegame/gamename/", async (req,res)=>{
    try{
        const gamename = req.query;
        const game = await Game.find(gamename);

        if(game.length === 0){
            return res.status(404).json({ error: "Failed to find the game" });
        }
        const deletedGamme = await Game.findOneAndDelete(gamename);
        res.json({message:"Game deleted successfully"})
    }catch(err){
        console.error(err);
        res.status(404).json({ error: "Game not found"});
    }
})

router.get("/addgame", isAuthenticated, (req,res)=>{
    res.render("addgame", {
        title:"Add a game to the Favorite Game Database",
        message:"Please add a game."
    })
});

module.exports = router;