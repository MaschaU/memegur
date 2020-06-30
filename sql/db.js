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
        `SELECT * FROM images ORDER BY id DESC`
    );
};

//inserting images into db

exports.insertIntoImages = function(url, title, description, username) {
    return db.query(
        `INSERT INTO images(url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING*`,
        [url, title, description, username]
    );
};

module.exports.getDataFromImages = (id) => {
    return db.query(
        `SELECT * FROM images WHERE id = $1 `,
        [id]
    );
};

module.exports.getComments = (id) => {
    return db.query(
        `SELECT * FROM comments WHERE image_id = $1 `,
        [id]
    );
};

module.exports.addComment = (imageId, username, comment) => {
    return db.query(
        `INSERT INTO comments (image_id, username, comment)VALUES($1,$2,$3) RETURNING *;`,
        [imageId, username, comment]
    );
};