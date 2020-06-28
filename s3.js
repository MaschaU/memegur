/* AMAZON WEB SERVICES */
const aws = require('aws-sdk');
const fs = require('fs');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_ID,
    secretAccessKey: secrets.AWS_SECRET
    
});

console.log("Credentials:", s3);

/* MIDDLEWARE FOR s3 */
exports.upload = (req, res, next) => {
    if (!req.file) {
        //upload did not work
        console.log("Error in 500!!:");
        return res.sendStatus(500);
        
    }
    const { filename, mimetype, size, path } = req.file;

    s3.putObject({
        Bucket: "spicedling", //where the file should be put
        ACL: "public-read", //anyone can read the file
        Key: filename,
        Body: fs.createReadStream(path),
        ContentType: mimetype,
        ContentLength: size
    }).promise().then(() => {
        console.log("body inside putObject promise", req.body);
        next();
        fs.unlink(path, () => { }); //forget the file..
    }).catch(err => {
        console.log(err);
        return res.sendStatus(500); //notify the client
    });
};