const mongoose = require("mongoose");

//Mongoose Schema and Model
const gameSchema = new mongoose.Schema({
    gamename:String,
    developer:String
});

module.exports = mongoose.model("Game", gameSchema,"favoritegames"); 