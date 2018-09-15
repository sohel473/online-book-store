-- 1. CUSTOMER TABLE
DROP DATABASE IF EXISTS online_book_shop;
CREATE DATABASE online_book_shop;
USE online_book_shop;

CREATE TABLE users (
    u_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. BOOKS TABLE
CREATE TABLE books (
    b_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    pages INT NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    released_year YEAR NOT NULL,
    ISBN VARCHAR(255) NOT NULL UNIQUE
);

-- 3. AUTHORS TABLE
CREATE TABLE authors (
    a_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    f_name VARCHAR(255) NOT NULL,
    l_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL
);

-- 4. AUTHORS_BOOKS TABLE
CREATE TABLE authors_books (
    author_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY(author_id) REFERENCES authors(a_id),
    FOREIGN KEY(book_id) REFERENCES books(b_id),
    PRIMARY KEY(author_id, book_id)
);

-- 5. PUBLISHERS TABLE
CREATE TABLE publishers (
    p_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(255) NOT NULL,
    website VARCHAR(255) NOT NULL
);

-- 6. publishers_books TABLE
CREATE TABLE publishers_books (
    publisher_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY(publisher_id) REFERENCES publishers(p_id),
    FOREIGN KEY(book_id) REFERENCES books(b_id),
    PRIMARY KEY(publisher_id, book_id)
);

-- 7. GENRE TABLE
CREATE TABLE genres (
    g_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(255) NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL
);

-- 8. BOOK_GENRE TABLE
CREATE TABLE books_genres (
    book_id INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(b_id),
    FOREIGN KEY(genre_id) REFERENCES genres(g_id)
);

-- -- 9. STORE HOUSE TABLE
-- CREATE TABLE store_houses (
--     s_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(255) NOT NULL UNIQUE,
--     address VARCHAR(255) NOT NULL,
--     phone VARCHAR(255) NOT NULL UNIQUE
-- );

-- -- storeHouse_books TABLE
-- CREATE TABLE strHouse_books (
--     strHouse_id INT NOT NULL,
--     book_id INT NOT NULL,
--     FOREIGN KEY(book_id) REFERENCES books(b_id),
--     FOREIGN KEY(strHouse_id) REFERENCES store_houses(s_id),
--     PRIMARY KEY(book_id, strHouse_id)
-- );

-- 9. REVIEWS TABLE
CREATE TABLE reviews (
    review_text TEXT NOT NULL,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY(book_id) REFERENCES books(b_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY(user_id) REFERENCES users(u_id) ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY(user_id, book_id)
);


-- 10. CHECKOUT TABLE
CREATE TABLE checkOut (
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    quantity INT NOT NULL,
    amount DOUBLE NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(b_id),
    FOREIGN KEY(user_id) REFERENCES users(u_id)
);

-- 11. ORDER TABLE
CREATE TABLE order_info (
    o_id INT NOT NULL AUTO_INCREMENT,
    o_date TIMESTAMP DEFAULT NOW(),
    amount DOUBLE NOT NULL,
    book_id INT  NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(b_id),
    FOREIGN KEY(user_id) REFERENCES users(u_id),
    PRIMARY KEY(o_id, user_id, book_id)
);