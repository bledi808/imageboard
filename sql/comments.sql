DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    comment VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    image_id INT NOT NULL REFERENCES images(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- INSERT INTO comments (comment, username, image_id) VALUES (
--     'nice photo dude, wowow',
--     'romario',
--     17
-- );
-- INSERT INTO comments (comment, username, image_id) VALUES (
--     'are you, like, a photographer?',
--     'bebeto',
--     16
-- );
-- INSERT INTO comments (comment, username, image_id) VALUES (
--     'what a boring snap',
--     'rivaldo',
--     15
-- );

INSERT INTO comments (comment, username, image_id) VALUES (
    'nice photo dude, wowow',
    'romario',
    16
);
INSERT INTO comments (comment, username, image_id) VALUES (
    'are you, like, a photographer?',
    'bebeto',
    17
);
INSERT INTO comments (comment, username, image_id) VALUES (
    'what a boring snap',
    'rivaldo',
    17
);

INSERT INTO comments (comment, username, image_id) VALUES (
    'nice photo dude, wowow',
    'romario',
    18
);
INSERT INTO comments (comment, username, image_id) VALUES (
    'are you, like, a photographer?',
    'bebeto',
    15
);
INSERT INTO comments (comment, username, image_id) VALUES (
    'what a boring snap',
    'rivaldo',
    16
);
