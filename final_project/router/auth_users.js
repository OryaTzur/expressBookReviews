const express = require('express');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if a username exists
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Function to authenticate a username and password
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login endpoint (optional in this simplified version)
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    return res.status(200).json({ message: `Welcome, ${username}!` });
});

// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
    const { username, review } = req.body; // Get username and review from the request body
    const isbn = req.params.isbn; // Get ISBN from URL parameter

    if (!username || !review) {
        return res.status(400).json({ message: "Username and review are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const { username } = req.body; // Get username from the request body
    const isbn = req.params.isbn; // Get ISBN from URL parameter

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
