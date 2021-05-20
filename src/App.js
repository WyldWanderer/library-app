import React, { useState, useEffect } from 'react';
import './App.css';
import BookList from './components/BookList.js'
import firebase from 'firebase'
import Database from './components/Database.js'

const App = () => {
  const[books, setBooks] = useState([])
  const [newBookAdded, addBook] = useState(false)

  const fetchingBooks = () => {
    const fetchedLibrary = []
    const db = firebase.database();
    db.ref("titles").on("value", (data) => {
      const libraryData = data.val();
      for (const [key] of Object.entries(libraryData)) {fetchedLibrary.push(libraryData[key])}
      setBooks(fetchedLibrary)
    })
  }

  useEffect(() => {
    fetchingBooks()
  }, [])
  
  //Function below was pulled from a Geeks for Geeks article on validating and ISBN number
  const isValidISBN = (isbn) => {  
    
    //Length must be 10 digits   
      let n = isbn.length;
      if (n !== 10)
          return false;
    //Calculates weighted sum of first 9 numbers
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        let digit = isbn[i] - '0';
            
        if (0 > digit || 9 < digit)
            return false;
                
        sum += (digit * (10 - i));
      }
  
    // Checking last digit.
      let last = isbn[9];
      if (last !== 'X' && (last < '0' || last > '9'))
          return false;
  
    // If last digit is 'X', add 10
    // to sum, else add its value.
      sum += ((last === 'X') ? 10 : (last - '0'));
  
    // Return true if weighted sum
    // of digits is divisible by 11.
      return (sum % 11 === 0);
  }

  const AddBook= () => {
    const db = firebase.database();
    const isbnToAdd = document.querySelector(".isbn-field").value
    
    if((isbnToAdd)) {
      fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnToAdd}&jscmd=data&format=json`) 
        .then((response) => {
          if(response.ok) {
            return response.json();  
          } else {
            throw response.status;
          }
        })
        .then((data) => {
          if(data[`ISBN:${isbnToAdd}`]["title"] && isbnToAdd) {
            db.ref("titles").push({
              title: data[`ISBN:${isbnToAdd}`]["title"],
              isbn: isbnToAdd,
              author: data[`ISBN:${isbnToAdd}`]["authors"]["0"]["name"],
              cover: data[`ISBN:${isbnToAdd}`]["cover"]["medium"]  
            }) 
          } else {
            console.log("There was a problem with the ISBN entered")
          }
        })
        addBook(true)

    } else {
      console.log("Is not a valid ISBN")
    }    
  }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Evie's Library!</h1>
          <p>Here you will find a list of all the books in Evie's current library. Be sure to check back often to see what she has been reading recently!</p>
          <p>You can add new books by entering the ISBN in the field below (no dashes or spaces)</p>
          <input className="isbn-field" placeholder="Input ISBN here"></input>
          <button className="button-style" onClick={AddBook}>Add A Book</button>
          <section>
            {books && books.map((book) => {
             const key = Object.keys(book)
             return <BookList book={book} databaseKey={key}/>
            })} 
          </section>
        </header>
      </div>
    );
}

export default App;
