const express = require("express");
const app = express();
const db = require("./sql/db.js");


app.use(express.static("public"));
app.use(express.json());


// boilerplate file upload
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

// multer is storing the files in our upload folder
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

//ROUTES//

// uploader runs our discStorage that needs to be up to 2MB
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

// communication between the server and axios
app.get("/images", (req, res)=>{
    db.getImages().then(result=>{
        res.json(result.rows);
    }).catch(error=>{
        console.log("Error in GET request:", error);
    });
});

// S3
const s3 = require("./s3.js");
const {s3Url} = require("./config.json");

app.get("/images", (req, res)=>{
    db.getImages().then(result=>{
        res.json(result.rows);
    }).catch(error=>{
        console.log("Error in GET:", error);
    });
});

// a route for listening requests for files
app.post("/upload", uploader.single("file"), s3.upload, (req, res)=>{
    const {filename} = req.file;
    const url = `${s3Url}${filename}`;
    const {title, description, username} = req.body;

    // at this point, we have sent the image to Amazon and have a URL it is
    // accessible under. We want to re-render the entire list of images,
    // with the new image in front.
    //
    // We do this by inserting the new image using the data we have about
    // it, specifically including the Amazon-provided URL, which will give
    // it the highest current serial# in the db table. This, combined with
    // our ORDER BY ID DESC, will put the newest image first.
    //
    // Once the image is inserted, we do a simple repeat of the entire
    // GET route. We could break it out into a separate function for
    // theoretically drier code, but with five lines total, it's
    // questionable if this improves readability and maintainability. 

    db.insertIntoImages(url, title, description, username).then(({rows})=>{
        return res.json(rows[0]);
    }).then((result) => {
        // This part is a verbatim repeat of the GET route
        db.getImages().then(result=>{
        }).catch(error=>{
            console.log("Error in GET request:", error);
        });
    }).catch(error=>{
        console.log(error);
    });
});

app.get('/image/:id', (req, res) => {
    db.getDataFromImages(req.params.id).then(result => {
        res.json(result.rows[0]);
    }).catch(err => {
        console.log(err);
    });
});

app.get('/comments/:id', (req, res) => {
    db.getComments(req.params.id).then(result => {
        res.json(result.rows);
    }).catch(err => {
        console.log(err);
    });
});

app.post('/comment', (req, res) => {

    const { imageId, username, comment } = req.body;
    db.addComment(imageId, username, comment).then(({ rows }) => {
        res.json(rows[0]);
    }).catch(err => {
        console.log(err);
    });
});





app.listen(8080, ()=> console.log("listening"));