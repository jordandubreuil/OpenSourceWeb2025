require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const flash = require("connect-flash");
const { allowedNodeEnvironmentFlags } = require("process");

const app = express();
const PORT = 3000;

//Passport Configuration
require("./config/passport")(passport);

//Set Handlebars as our templating engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

//Sets our static resources folder
app.use(express.static(path.join(__dirname,"public")));

//Middleware body-parser parses jsons requests
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Setup Express-Session Middleware
app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true
}))

//Setup Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Setup Flash messaging
app.use(flash());

//Global Variables for Flash Messages
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

//Required Route Router Example
app.use("/", require("./routes/auth"));

//MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/gamelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;
//check for connection
db.on("error", console.error.bind(console, "MonoDB Connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});

//Mongoose Schema and Model
const gameSchema = new mongoose.Schema({
    gamename:String,
    developer:String
});

const Game = mongoose.model("Game", gameSchema,"favoritegames"); 

//CRUD app examples Connection to databas route examples below

//get route to get data from database
app.get("/games", async (req,res)=>{
    try{
        const games = await Game.find();
        res.json(games);
    }catch(err){
        res.status(500).json({error:"Failed to fetch game data"});
    }
});

//get route for a single user
app.get("/games/:id", async (req,res)=>{
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
app.post("/addgame", async (req,res)=>{
    console.log(req.body.gamename);
    try{
        const newGame = new Game(req.body);
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
        console.log(savedGame);
    }catch(err){
        app.put("/users/:id", async (req, res) => {
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
app.put("/updategame/:id", (req,res)=>{
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
app.delete("/deletegame/gamename/", async (req,res)=>{
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

let message = "Wouldn't you like to be a pepper too??";

function tellTheMessage(){
    console.log(message);
}

//tellTheMessage();

//Handlebars examples
app.get("/hbsindex", (req,res)=>{
    res.render("home", {
        title:"Welcome to the Handlbars Site",
        message:"This is our page using the template engine"
    })
});

app.get("/addgame", (req,res)=>{
    res.render("addgame", {
        title:"Add a game to the Favorite Game Database",
        message:"Please add a game."
    })
});
//This is an example of a route
app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/json",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "players.json"));
});

app.get("/nodemon",(req,res)=>{
    res.sendStatus(500);
})

//Creates Listener on port 3000
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})