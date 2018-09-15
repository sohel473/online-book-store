const   mysql           = require("mysql"),
        bodyParser      = require("body-parser"),
        methodOverride  = require("method-override"),
        express         = require("express"),
        app             = express();
        
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//connecting to mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'sohel47',
    database: 'online_book_shop'
});

//============
// GET ROUTE
//============

// ROOT ROUTE
app.get("/", function (req, res) {
    res.redirect("/books");
});

// INDEX ROUTE
app.get("/books", function (req, res) {
  var q = 'SELECT * FROM books ORDER BY RAND()';
    connection.query(q, function (err, results) {
        if(err) {
            console.log(err);
        } else {
            res.render("books/index", {books: results});
        }
    });
});

// SHOW ROUTE
app.get("/books/:id", function(req, res) {
    var book_id = req.params.id;
    var qBook = 'SELECT * FROM books WHERE b_id = ' + book_id;
    var qAuthors = "SELECT a_id, books.title,CONCAT(f_name, ' ', l_name) AS authors_name FROM books INNER JOIN authors_books ON books.b_id = authors_books.book_id INNER JOIN authors ON authors.a_id = authors_books.author_id WHERE books.b_id = " + book_id;
    var qPub = "SELECT p_id, books.title, publishers.name as publishers_name FROM books INNER JOIN publishers_books ON books.b_id = publishers_books.book_id INNER JOIN publishers ON publishers.p_id = publishers_books.publisher_id WHERE books.b_id = " + book_id;
    var qGen = "SELECT b_id,g_id, title, genre_name FROM books INNER JOIN books_genres ON books.b_id = books_genres.book_id INNER JOIN genres ON genres.g_id = books_genres.genre_id WHERE books.b_id = " + book_id;
    var qRev = "SELECT * FROM reviews INNER JOIN users ON users.u_id = reviews.user_id INNER JOIN books ON books.b_id = reviews.book_id WHERE b_id = " + book_id;
    
    connection.query(qBook, function (err, foundBook) {
        if(err) {
            console.log(err);
        } else {
            connection.query(qAuthors, function(err, foundAuthors) {
                if(err){
                    console.log(err);
                } else {
                    connection.query(qPub,  function(err, foundPub) {
                        if(err){
                            console.log(err);
                        } else {
                            connection.query(qGen, function(err, foundGen) {
                                if(err){
                                    console.log(err);
                                } else {
                                    connection.query(qRev, function(err, foundRev) {
                                        if(err){
                                            console.log(err);
                                        } else {
                                            res.render("books/show", {
                                                book: foundBook,
                                                authors: foundAuthors,
                                                publisher: foundPub,
                                                genres: foundGen,
                                                reviews: foundRev
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    
});

//AUTHORS ROUTE
app.get("/authors", function(req, res) {
    var q = "SELECT a_id, CONCAT(f_name, ' ', l_name) AS name, image FROM authors ORDER BY RAND()";
    
    connection.query(q, function(err, foundAuthors) {
        if(err){
            console.log(err);
        } else {
            res.render("authors/allAuthors", {authors: foundAuthors});
        }
    });
});

//AUTHOR INFO ROUTE
app.get("/authors/:id", function(req, res) {
    var author_id = req.params.id;
    var q = "SELECT b_id, books.title, books.image AS book_image, a_id, CONCAT(f_name, ' ', l_name) AS name, authors.image AS author_image FROM books INNER JOIN authors_books ON books.b_id = authors_books.book_id INNER JOIN authors ON authors.a_id = authors_books.author_id WHERE a_id = " + author_id +" ORDER BY RAND()";
    
    connection.query(q, function(err, foundAuthor) {
        if(err){
            console.log(err);
        } else {
            res.render("authors/show", {author: foundAuthor});
        }
    });
});

// Publishers ROUTE
app.get("/publishers", function(req, res) {
    var q = "SELECT * FROM publishers ORDER BY RAND()";
    
    connection.query(q, function(err, foundPubs) {
        if(err){
            console.log(err);
        } else {
            res.render("publishers/allPublishers", {publishers: foundPubs});
        }
    });
});

//Publisher INFO ROUTE
app.get("/publishers/:id", function(req, res) {
    var author_id = req.params.id;
    var q = "SELECT  b_id, books.title, books.image AS book_image, p_id, publishers.name AS publisher_name, publishers.image AS pub_image, website FROM books INNER JOIN publishers_books ON books.b_id = publishers_books.book_id INNER JOIN publishers ON publishers.p_id = publishers_books.publisher_id WHERE p_id = " + author_id +" ORDER BY RAND()";
    
    connection.query(q, function(err, foundPub) {
        if(err){
            console.log(err);
        } else {
            res.render("publishers/show", {publisher: foundPub});
        }
    });
});

//GENRES ROUTE
app.get("/genres", function(req, res) {
    var q = "SELECT * FROM genres ORDER BY RAND()";
    
    connection.query(q, function(err, foundGens) {
        if(err){
            console.log(err);
        } else {
            res.render("genres/allGenres", {genres: foundGens});
        }
    });
});

// GENRE INFO ROUTE
app.get("/genres/:id", function(req, res) {
    var genre_id = req.params.id;
    
    var q = "SELECT b_id, title,books.image AS book_image, g_id, genre_name FROM books INNER JOIN books_genres ON books.b_id = books_genres.book_id INNER JOIN genres ON genres.g_id = books_genres.genre_id WHERE g_id = " + genre_id +" ORDER BY RAND()";
    
    connection.query(q, function(err, foundGen) {
        if(err){
            console.log(err);
        } else {
            res.render("genres/show", {genre: foundGen});
        }
    });
    
});

//SEARCH RESULT ROUTE
app.get("/search", function(req, res) {
    var result = req.query.search;
    
    var q = 'SELECT DISTINCT books.title, books.image, b_id FROM books INNER JOIN authors_books ON books.b_id = authors_books.book_id INNER JOIN authors ON authors.a_id = authors_books.author_id WHERE books.ISBN LIKE "%'+result+'%" OR books.title LIKE "%'+result+'%" OR authors.f_name LIKE "%'+result+'%" OR authors.l_name LIKE "%'+result+'%" OR authors.name LIKE "%'+result+'%"';
    
    // console.log(result);
    // console.log(q);
    
    connection.query(q, function(err, foundRes) {
        if(err){
            console.log(err);
        } else {
            res.render("search/results", {results: foundRes});
        }
    });
});



// updateReview Route
app.get("/review/edit/:book_id/:user_id", function(req, res) {
    var BOOK_ID = req.params.book_id;
    var USER_ID = req.params.user_id;
    var q = "SELECT * FROM reviews INNER JOIN users ON users.u_id = reviews.user_id INNER JOIN books ON books.b_id = reviews.book_id WHERE book_id = "+ BOOK_ID+" AND user_id = "+USER_ID;
    
    
    connection.query(q, function(err, foundRev) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/editRev", {review: foundRev});
        }
    });
});

// delete review ROUTE
app.get("/review/delete/:book_id/:user_id", function(req, res) {
    var BOOK_ID = req.params.book_id;
    var USER_ID = req.params.user_id;
    var q = "SELECT * FROM reviews INNER JOIN users ON users.u_id = reviews.user_id INNER JOIN books ON books.b_id = reviews.book_id WHERE book_id = "+ BOOK_ID+" AND user_id = "+USER_ID;
    
    connection.query(q, function(err, deleteRev) {
        if(err){
            console.log(err);
        } else {
            res.render("reviews/delRev", {deleteRev: deleteRev});
        }
    });
});

//reviews ROUTE
app.get("/review/:id", function(req, res) {
    var book_id = req.params.id;
    var q = "SELECT books.title, books.b_id FROM books WHERE b_id = " + book_id;
    
    connection.query(q, function(err, foundBook) {
        if(err) {
            console.log(err);
        } else {
            res.render("reviews/newRev.ejs", {book: foundBook});        
        }
    });
});


//============
// POST ROUTE
//============

//create review ROUTE
app.post("/review/:id", function (req, res) {
    var book_id = req.params.id;
    var user_NAME = req.body.userName;
    var flag = 0;
    
    var q = "SELECT * FROM users";
    connection.query(q, function(err, users) {
        if(err){
            console.log(err);
        } else {
            for(var i =0;i<users.length;i++){
                if(users[i].user_name === user_NAME){
                    flag = 1;
                    break;
                } else {
                    flag = 0;
                }
            }
            if(flag===0){
                var iUser = "INSERT INTO users SET ?";
                var user = {
                    user_name: user_NAME
                };
                
                connection.query(iUser, user, function(err, userInfo) {
                    if(err){
                        console.log(err);
                    } else {
                        var qUserId = "SELECT * FROM users WHERE user_name = '" + user_NAME+"'";
                        
                        connection.query(qUserId, function(err, userInfo2){
                            if(err){
                                console.log(err);
                            } else {
                                var iReview = "INSERT INTO reviews SET ?";
                                var review = {
                                    review_text: req.body.comment,
                                    book_id: book_id,
                                    user_id: userInfo2[0].u_id
                                };
                                
                                connection.query(iReview, review, function(err, reviewInfo) {
                                    if(err){
                                       res.render("reviews/errorRev", {book_id: book_id});
                                    } else {
                                        res.redirect("/books/"+book_id);
                                    }
                                });
                            }
                        });
                    }
                });
            } else{
                var qUserId = "SELECT * FROM users WHERE user_name = '" + user_NAME+"'";
                        
                connection.query(qUserId, function(err, userInfo2){
                    if(err){
                        console.log(err);
                    } else {
                        var iReview = "INSERT INTO reviews SET ?";
                        var review = {
                            review_text: req.body.comment,
                            book_id: book_id,
                            user_id: userInfo2[0].u_id
                        };
                        
                        connection.query(iReview, review, function(err, reviewInfo) {
                            if(err){
                                res.render("reviews/errorRev", {book_id: book_id});
                            } else {
                                res.redirect("/books/"+book_id);
                            }
                        });
                    }
                });
            }
        }
    });
});

//==============
// PUT ROUTE
//==============

// updateReview Route
app.put("/review/edit/:book_id/:user_id", function (req, res) {
    var BOOK_ID = req.params.book_id;
    var USER_ID = req.params.user_id;
    var newComment = req.body.comment;
    var q= "SELECT * FROM reviews INNER JOIN users ON users.u_id = reviews.user_id INNER JOIN books ON books.b_id = reviews.book_id WHERE book_id = "+BOOK_ID+" AND user_id = "+USER_ID;
    
    var qReview = "UPDATE reviews SET ? WHERE book_id = "+BOOK_ID+" AND user_id = "+USER_ID;
    var reviews = {
        review_text: newComment
    };
    
    connection.query(q, function(err, reviewInfo) {
        if(err){
            console.log(err);
        } else {
            connection.query(qReview, reviews, function(err, reviewInfo2) {
                if(err){
                    console.log(err);
                } else {
                    res.redirect("/books/"+reviewInfo[0].b_id);
                }
            });
        }
    });
});

//=============
//DELETE ROUTE
//=============

// delete review ROUTE
app.delete("/review/delete/:book_id/:user_id", function (req, res) {
    var BOOK_ID = req.params.book_id;
    var USER_ID = req.params.user_id;
    // var q = "SELECT * FROM reviews INNER JOIN users ON users.u_id = reviews.user_id INNER JOIN books ON books.b_id = reviews.book_id WHERE book_id = "+ BOOK_ID+" AND user_id = "+USER_ID;
    
    var dRev = "DELETE FROM reviews WHERE book_id = "+BOOK_ID+" AND user_id ="+USER_ID;
    var reviews = {
        book_id: BOOK_ID,
        user_id: USER_ID
    };

    connection.query(dRev, reviews, function(err, reviewInfo) {
        if(err){
            console.log(err);
        } else {
            res.redirect("/books/"+BOOK_ID);
        }
    });
    
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server Has Started........");
});