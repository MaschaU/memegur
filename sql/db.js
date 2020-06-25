const spicedPg = require("spiced-pg");

//heroku setup
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const {dbUser, dbPass} = require("../secrets");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);
}

//getting the images

exports.getImages = function() {
    return db.query(
        `SELECT * FROM images`
    );
};
