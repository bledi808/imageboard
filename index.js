const express = require("express");
const app = express();

///////////////////////////////////////middleware
app.use(express.static("public"));

///////////////////////////////////////middleware

app.listen(8080, () => {
    console.log("imageboard running");
});
