const express = require("express");
const app = express();
const db = require("./db");

///////////////////////////////////////middleware
app.use(express.static("public"));

///////////////////////////////////////routes
app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            console.log("result", rows);
            console.log("rows.length", rows.length);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in /citiies with getImages()", err);
        });
    console.log();
});

app.listen(8080, () => {
    console.log("imageboard running");
});
