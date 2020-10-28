const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const s3Url = "https://s3.amazonaws.com/pimento-imgboard/";

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
app.use(
    express.urlencoded({
        extended: false,
    })
);
///////////////////////////////////////routes
app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch((err) => {
            console.log("error in GET /images with getImages()", err);
        });
});
app.get("/images/:id", (req, res) => {
    const { id } = req.params;
    console.log("req.body:", req.params);
    console.log("id:", id);
    db.getImageById(id)
        .then(({ rows }) => {
            res.json(rows[0]);
            console.log(rows);
        })
        .catch((err) => {
            console.log("error in GET /images with getImages()", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { username, title, description } = req.body;
    const { filename } = req.file;
    const url = s3Url + filename;
    if (req.file) {
        db.addImages(url, username, title, description)
            .then((results) => {
                res.json(results);
                console.log("results", results);
            })
            .catch((err) => {
                console.log("error in POST /upload with addImages()", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.listen(8080, () => {
    console.log("imageboard running");
});
