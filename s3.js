const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
}); // creates an instance of an AWS user

exports.upload = (req, res, next) => {
    if (!req.file) {
        //smth went wrong with multer or user didn't select an img
        console.log("no image to upload");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "pimento-imgboard",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            // it worked!!!
            console.log("image made it to the cloud");
            next(); // ebsure to exit middleware after successful upload
            // / optionally choose to remove the file just uploaded to the cloud from the uploads directory
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            // uh oh
            console.log("smth went wrong with uploading to the cloud: ", err);
        });
};
