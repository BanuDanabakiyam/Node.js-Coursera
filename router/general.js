const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  } 
  return res.status(404).json({message: "Unable to register user."});

});

// Get the book list available in the shop
public_users.get('/', async (req, res) =>
{
  try {  
  const allBooks = await getBooksAsync();   
  return res.status(200).json(res.send(allBooks));   }
catch (error)
{   
 return res.status(500).json({ message: 'An error occurred while fetching books.' });   } }); 
async function getBooksAsync()
{   
return new Promise((resolve, reject) => {     
setTimeout(() => {     
 resolve(books);     }, 1000);   }); }  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  console.log(isbn)

  searchBookByISBN(isbn)
    .then((filteredBooks) => {
      return res.status(200).json(res.send(filteredBooks));
    })
    .catch((error) => {
      return res.status(500).json({ message: 'An error occurred while searching for the book.' });
    });
});

function searchBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = books.filter((book) => book.isbn === isbn);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error('Book not found'));
      }
    }, 500);
  });
}

// Get book details based on author

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;

  searchBookByISBN(author)
    .then((filteredAuthor) => {
      return res.status(200).json(res.send(filteredAuthor));
    })
    .catch((error) => {
      return res.status(500).json({ message: 'An error occurred while searching for the book.' });
    });
});

function searchBookByISBN(author) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = books.filter((book) => book.author === author);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error('Author not found'));
      }
    }, 500);
  });
}

// Get all books based on title

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  searchBookByISBN(title)
    .then((filteredTitle) => {
      return res.status(200).json(res.send(filteredTitle));
    })
    .catch((error) => {
      return res.status(500).json(res.send({ message: 'An error occurred while searching for the book.' }));
    });
});

function searchBookByISBN(title) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = books.filter((book) => book.title === title);
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject(new Error('Title not found'));
      }
    }, 500);
  });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = req.params.review;
  const filtered_review  = books.filter((book) => book.reviews === review);
  return res.status(200).json(filtered_review);
});

module.exports.general = public_users;