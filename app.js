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
const Game = require("./models/Game");

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
app.use("/", require("./routes/auth").router);
app.use("/", require("./routes/crud"));

//MongoDB Database connection
const mongoURI = "mongodb://localhost:27017/gamelibrary"
mongoose.connect(mongoURI);
const db = mongoose.connection;
//check for connection
db.on("error", console.error.bind(console, "MonoDB Connection error"));
db.once("open", ()=>{
    console.log("Connected to MongoDB Database");
});





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