const express = require("express");
const path = require("path")

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname,"public")));


let message = "Wouldn't you like to be a pepper too??";

function tellTheMessage(){
    console.log(message);
}

//tellTheMessage();

//This is an example of a route
app.get("/",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/json",(req, res)=>{
    res.sendFile(path.join(__dirname, "public", "players.json"));
});

//Creates Listener on port 3000
app.listen(PORT, ()=>{
    console.log("Server running on port 3000.");
})