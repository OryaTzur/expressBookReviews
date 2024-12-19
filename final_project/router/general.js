const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// curl -X POST "http://localhost:5000/register" -H "Content-Type: application/json" -d '{"username":"orya","password":"123"}'
public_users.post("/register", (req,res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Add the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
//curl http://localhost:5000/
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
//curl http://localhost:5000/isbn/1
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters
    const book = books[isbn]; // Find the book in the books database
    
    if (book) {
      return res.status(200).json(book); // Return book details if found
    } else {
      return res.status(404).json({ message: "Book not found" }); // Return error if ISBN is not found
    }
 });
  
// Get book details based on author
//curl http://localhost:5000/author/Chinua%20Achebe
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author; // Retrieve author from request parameters
    const booksByAuthor = Object.values(books).filter(book => book.author === author); // Filter books by author
  
    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor); // Return list of books by the author
    } else {
      return res.status(404).json({ message: "No books found by this author" }); // Return error if no books match
    }
});

// Get all books based on title
//curl http://localhost:5000/title/Things%20Fall%20Apart
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // Retrieve title from request parameters
    const booksByTitle = Object.values(books).filter(book => book.title === title); // Filter books by title
  
    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle); // Return list of books with the matching title
    } else {
      return res.status(404).json({ message: "No books found with this title" }); // Return error if no books match
    }  
});

// Get book review
// curl "http://localhost:5000/review/1"
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from request parameters

    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews); // Return the reviews for the specified book
    } else {
      return res.status(404).json({ message: "Book not found" }); // Return error if ISBN does not exist
    }
});

module.exports.general = public_users;
