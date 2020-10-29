var spicedPg = require("spiced-pg"); // middleman or client
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/imageboard"
);

module.exports.getImages = () => {
    return db.query(
        `
        SELECT * FROM images
        ORDER BY id DESC
        LIMIT 3;
        `
    );
};

module.exports.loadMoreImages = (lowestId) => {
    return db.query(
        `
        SELECT url, username, title, description, id, 
        (SELECT id FROM images
            ORDER BY id ASC
            LIMIT 1) 
                AS "lowestId"
        FROM images 
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3;
        `,
        [lowestId]
    );
};

module.exports.getImageById = (image_id) => {
    return db.query(
        `
        SELECT * FROM images
        WHERE id=$1`,
        [image_id]
    );
};

module.exports.addImages = (url, username, title, description) => {
    return db.query(
        `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
        [url, username, title, description]
    );
};
