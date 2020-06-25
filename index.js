const express = require("express");
const app = express();
const spicedPg = require("spiced-pg");
const db = require("./sql/db.js");


app.use(express.static("public"));

app.get("/images", (req, res)=>{
    db.getImages().then(result=>{
        res.json(result.rows);
    }).catch(error=>{
        console.log("Error:", error);
    });
});

/*let cities = [
    {
        name: "Berlin",
        country: "Germany"
    },
    {
        name: "Zagreb",
        country: "Croatia"
    },
    {
        name: "Tel Aviv",
        country: "Israel"
    }
];

//communication between the server and axios
app.get("/cities", (req, res)=>{
    res.json(cities);
});*/

app.listen(8080, ()=> console.log("listening"));