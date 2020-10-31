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
        LIMIT 6;
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
        LIMIT 6;
        `,
        [lowestId]
    );
};

module.exports.getImageById = (image_id) => {
    return db.query(
        `
        SELECT * ,
        (SELECT id FROM images
            WHERE id > $1
            ORDER BY id ASC
            LIMIT 1) 
                AS "nextId",
        (SELECT id FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 1) 
                AS "previousId"
        FROM images
        WHERE id=$1`,
        [image_id]
    );
};

// module.exports.getImageById = (image_id) => {
//     return db.query(
//         `
//         SELECT * FROM images
//         WHERE id=$1`,
//         [image_id]
//     );
// };

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

module.exports.getCommentsById = (image_id) => {
    return db.query(
        `
        SELECT * FROM comments
        WHERE image_id=$1`,
        [image_id]
    );
};

module.exports.addComment = (comment, username, id) => {
    return db.query(
        `
        INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [comment, username, id]
    );
};
