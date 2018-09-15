-- FIND books and its authors
SELECT b_id, books.title,a_id, CONCAT(f_name, ' ', l_name) AS name 
FROM books
INNER JOIN authors_books
    ON books.b_id = authors_books.book_id
INNER JOIN authors
    ON authors.a_id = authors_books.author_id
ORDER BY b_id, a_id;

-- FIND books and its publishers
SELECT b_id, books.title,p_id, publishers.name as "Publisher name" 
FROM books
INNER JOIN publishers_books
    ON books.b_id = publishers_books.book_id
INNER JOIN publishers
    ON publishers.p_id = publishers_books.publisher_id
ORDER BY b_id, p_id;

--Find books and its genres
SELECT b_id, title, genre_name FROM books
INNER JOIN books_genres
    ON books.b_id = books_genres.book_id
INNER JOIN genres
    ON genres.g_id = books_genres.genre_id
ORDER BY b_id;

-- Find books and its authors,publishers and genres
SELECT 
    books.title, 
    CONCAT(f_name, " ", l_name) AS authors_name, 
    publishers.name, 
    genres.genre_name 
FROM books 
INNER JOIN authors_books 
    ON books.b_id = authors_books.book_id 
INNER JOIN authors 
    ON authors.a_id = authors_books.author_id 
INNER JOIN publishers_books 
    ON books.b_id = publishers_books.book_id 
INNER JOIN publishers 
    ON publishers.p_id = publishers_books.publisher_id 
INNER JOIN books_genres 
    ON books.b_id = books_genres.book_id 
INNER JOIN genres 
    ON genres.g_id = books_genres.genre_id;



-- book name
SELECT books.title FROM books WHERE books.b_id = 9;

--book and its authors name
SELECT books.title,CONCAT(f_name, ' ', l_name) AS authors_name 
FROM books
INNER JOIN authors_books
    ON books.b_id = authors_books.book_id
INNER JOIN authors
    ON authors.a_id = authors_books.author_id
WHERE books.b_id = 9;

-- book and its publishers
SELECT books.title, publishers.name as publishers_name 
FROM books
INNER JOIN publishers_books
    ON books.b_id = publishers_books.book_id
INNER JOIN publishers
    ON publishers.p_id = publishers_books.publisher_id
WHERE books.b_id = ;

-- book and its genres
SELECT b_id, title, genre_name FROM books
INNER JOIN books_genres
    ON books.b_id = books_genres.book_id
INNER JOIN genres
    ON genres.g_id = books_genres.genre_id
WHERE books.b_id = ;

-- finds all authors
SELECT a_id, CONCAT(f_name, " ", l_name) AS name, image FROM authors ORDER BY l_name;

-- find specific author and his/her books
SELECT b_id, books.title, books.image, a_id, CONCAT(f_name, ' ', l_name) AS name, authors.image 
FROM books
INNER JOIN authors_books
    ON books.b_id = authors_books.book_id
INNER JOIN authors
    ON authors.a_id = authors_books.author_id
WHERE a_id = 2;

-- finds all publishers
SELECT * FROM publishers;

-- find specific publisher and its books
SELECT  b_id, 
        books.title, 
        books.image AS book_image, 
        p_id, 
        publishers.name AS publisher_name, 
        publishers.image AS pub_image
FROM books
INNER JOIN publishers_books
    ON books.b_id = publishers_books.book_id
INNER JOIN publishers
    ON publishers.p_id = publishers_books.publisher_id
WHERE p_id = 2;

-- All genres
SELECT * FROM genres;

-- genre and its books
SELECT b_id, title, g_id, genre_name FROM books
INNER JOIN books_genres
    ON books.b_id = books_genres.book_id
INNER JOIN genres
    ON genres.g_id = books_genres.genre_id
WHERE g_id = 10
ORDER BY RAND();

-- max genre
SELECT genre_name, COUNT(*) AS TOTAL FROM books
INNER JOIN books_genres
    ON books.b_id = books_genres.book_id
INNER JOIN genres
    ON genres.g_id = books_genres.genre_id
GROUP BY g_id
ORDER BY TOTAL DESC;


-- search and retrieve
SELECT DISTINCT books.title, books.image, b_id
FROM books
INNER JOIN authors_books
    ON books.b_id = authors_books.book_id
INNER JOIN authors
    ON authors.a_id = authors_books.author_id
WHERE 
    books.ISBN LIKE "%rowling%" 
    OR books.title LIKE "%rowling%" 
    OR authors.f_name LIKE "%rowling%"
    OR authors.l_name LIKE "%rowling%"
    OR authors.name LIKE "%rowling%"
    OR authors.f_name LIKE "%rowling"
    OR authors.l_name LIKE "%rowling"
    OR authors.f_name LIKE "rowling%"
    OR authors.l_name LIKE "rowling%";
    
    
    
-- FIND reviews of books and its user

SELECT * FROM reviews
INNER JOIN users
    ON users.u_id = reviews.user_id
INNER JOIN books
    ON books.b_id = reviews.book_id
WHERE b_id = 27;