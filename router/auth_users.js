const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')

const regd_users = express.Router();

let users = [];

const authenticatedUser = (username,password)=>{
  console.log("Inside user",username);
  console.log("Inside password",password);
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  console.log("Inside Valid user:",validusers);
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store the user's data in the session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});
regd_users.get("/auth/get_message", (req,res) => {
  return res.status(200).json({message: "Hello, You are an authenticated user. Congratulations!"});

});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  console.log("Inside put")
  const isbn =req.params.isbn;
  const review =req.params.review;
  console.log("isbn :",isbn);
  console.log("reviews :",review);
  if(!isbn || !review){

    return res.status(400).json({ message: 'Please provide a valid ISBN and review' });
  }
  const bookIndex = books.findIndex((book) => book.isbn === isbn);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  if(!books[bookIndex].reviews) {
    books[bookIndex].reviews = [];
  }

  books[bookIndex].reviews.push(review);

  return res.status(200).json({ message: 'Review added successfully' });
});


regd_users.delete("/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: 'Please provide a valid ISBN.' });
  }

  const bookIndex = books.findIndex((book) => book.isbn === isbn);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
   books[bookIndex].reviews.pop();

  return res.status(200).json({ message: 'Review deleted successfully' });
});

module.exports.authenticated = regd_users;
module.exports.users = users;