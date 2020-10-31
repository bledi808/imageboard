const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { monitorEventLoopDelay } = require("perf_hooks");
const s3Url = "https://s3.amazonaws.com/pimento-imgboard/";

app.use(express.static("public"));
app.use(express.json());

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

app.get("/more/:lowestId", (req, res) => {
    const { lowestId } = req.params;
    db.loadMoreImages(lowestId)
        .then(({ rows }) => {
            res.json(rows);
            console.log("rows in load more", rows);
        })
        .catch((err) => {
            console.log("error in GET /more with loadMoreImages()", err);
        });
});

app.get("/images/:id", (req, res) => {
    const { id } = req.params;
    db.getImageById(id)
        .then(({ rows }) => {
            res.json(rows[0]);
            console.log("rows is in getImagebyId: ", rows);
            console.log("rows[0] is in getImagebyId: ", rows[0]);
        })
        .catch((err) => {
            console.log("error in GET /images with getImagesbyId()", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { username, title, description } = req.body;
    const { filename } = req.file;
    const url = s3Url + filename;
    if (req.file) {
        db.addImages(url, username, title, description)
            .then(({ rows }) => {
                console.log("upload response", rows[0]);
                res.json(rows[0]);
            })
            .catch((err) => {
                console.log("error in POST /upload with addImages()", err);
            });
    } else {
        res.json({ success: false });
    }
});

app.get("/comments/:id", (req, res) => {
    const { id } = req.params;
    // console.log("req.params in GET /comments/id:", req.params);
    // console.log("id:", id);
    db.getCommentsById(id)
        .then(({ rows }) => {
            res.json(rows);
            // console.log("rows is in GET /comments/id: ", rows);
        })
        .catch((err) => {
            console.log("error in GET /images with getImages()", err);
        });
});

app.post("/comment", (req, res) => {
    console.log("req.body in POST /comment", req.body);
    const { comment, username, id } = req.body;

    db.addComment(comment, username, id)
        .then(({ rows }) => {
            res.json(rows[0]);
            console.log("results in POST /comment", rows);
        })
        .catch((err) => {
            console.log("error in POST /upload with addImages()", err);
        });
});

app.listen(8080, () => {
    console.log("imageboard running");
});
