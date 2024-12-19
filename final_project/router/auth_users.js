const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
//curl -X POST "http://localhost:5000/customer/login" -H "Content-Type: application/json" -d '{"username":"orya","pa
// ssword":"123"}
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const accessToken = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });

    // Save the token in the session
    req.session.authorization = { accessToken, username };

    // Save the session ID as a cookie
    const sessionId = req.sessionID; // Get the session ID
    res.cookie('connect.sid', sessionId, { httpOnly: true });

    return res.status(200).json({ message: "User successfully logged in", sessionId});   
});

// Add a book review
//curl -X PUT "http://localhost:5000/customer/auth/review/1?review=Fantastic%20read!" -H "Cookie: your_session_cookie_here"
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from the request parameters
    const review = req.query.review; // Extract review from the request query
    const username = req.session.authorization?.username; // Get the username from the session
  
    // Check if the user is logged in
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // Check if the review is provided
    if (!review) {
      return res.status(400).json({ message: "Review must be provided" });
    }
  
    // Check if the book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update the review
    if (!book.reviews) {
      book.reviews = {};
    }
  
    book.reviews[username] = review;
  
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: book.reviews,
    });
    
});

// Delete a book review
// curl -X DELETE "http://localhost:5000/customer/auth/review/1" -H "Cookie: your_session_cookie_here"
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // Extract ISBN from the request parameters
    const username = req.session.authorization?.username; // Get the username from the session
  
    // Check if the user is logged in
    if (!username) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // Check if the book exists
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if reviews exist for the book
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    // Delete the user's review
    delete book.reviews[username];
  
    return res.status(200).json({
      message: "Review deleted successfully",
      reviews: book.reviews,
    });
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
