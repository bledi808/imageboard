const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

app.use(express.static("public"));

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

///////////////////////////////////////middleware

///////////////////////////////////////routes
app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            // console.log("result", rows);
            // console.log("rows.length", rows.length);
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in /citiies with getImages()", err);
        });
    console.log();
});

app.post("/upload", uploader.single("file"), (req, res) => {
    //multer adds the file and the body to the request obj - req.body
    //for Part 2; do a db query to insert all of this info into the db (to do this; we need the following file properties: filename and )
    //once inserted; send all of this info to vue
    console.log("input values: ", req.body);
    console.log("file: ", req.file);
    if (req.file) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => {
    console.log("imageboard running");
});
