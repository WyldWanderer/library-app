import React, { useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import firebase from 'firebase'
import Database from './components/Database.js'

import BookList from './components/BookList.js'
import { isValidISBN } from './helpers/validators';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const App = () => {
  const[books, setBooks] = useState([])
  const [searchInput, updateSearch] = useState("")
  const [searchResults, searchedBookList] = useState([])

  library.add(fab, faHeart)

  // Retrieve books from database
  const fetchingBooks = () => {
    const fetchedLibrary = []
    const db = firebase.database();
    db.ref("titles").get().then((data) => {
      const libraryData = data.val();
      for (const [key] of Object.entries(libraryData)) {fetchedLibrary.push(libraryData[key])}
      setBooks(fetchedLibrary)
    })
  }

  useEffect(() => {
      fetchingBooks()
  }, [])
  
  // Function to check DB to see if the ISBN being added already exists in the DB (prevents duplicate books)
  const checkDBForISBN = (isbnToCheck) => {
    const currentISBN = books.map((book) => {
      return book.isbn === isbnToCheck ?  true : false; 
      })
    return currentISBN.includes(true) ? true : false; 
  }

  // Function to check the database, validate the ISBN and add the book to the database
  const AddBook= () => {
    const db = firebase.database();
    const isbnToAdd = document.querySelector(".isbn-field")

    if(!checkDBForISBN(isbnToAdd.value) && isValidISBN(isbnToAdd.value)) {
      fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnToAdd.value}&jscmd=data&format=json`) 
        .then((response) => {
          if(response.ok) {
            return response.json();  
          } else {
            throw response.status;
          }
        })
        .then((data) => {
          let isThereACover = false;
          if (data[`ISBN:${isbnToAdd.value}`]["cover"]) { 
            isThereACover = data[`ISBN:${isbnToAdd.value}`]["cover"]["medium"]
          }

          if(data[`ISBN:${isbnToAdd.value}`]["title"] && isbnToAdd.value) {
            db.ref("titles").push({
              title: data[`ISBN:${isbnToAdd.value}`]["title"],
              isbn: isbnToAdd.value,
              author: data[`ISBN:${isbnToAdd.value}`]["authors"]["0"]["name"],
              cover: isThereACover,
              favorite: false  
            }) 
          } else {
            console.log("There was a problem finding the ISBN entered")
          }
        })
        .then(() => {
          fetchingBooks()
        })
    } else {
      console.log("This book has already been added or the ISBN is not valid")
    } 
    console.log(books)   
  }

  // Book search function
  const searchBooksInput = (event) => {
    updateSearch(event.target.value)
    const filteredBooks = 
      books.filter((book) => {
        return book.title.toLowerCase().includes(searchInput.toLowerCase())
      })

    if(filteredBooks) {
      searchedBookList(filteredBooks)
    }
  }

  // Delete the book from database and update state
  const deleteBook = (isbnToRemove) => {
    const db = firebase.database();
    db.ref("titles").get().then((data) => {
      const libraryData = data.val()
      const updatedBooks = []

      for (const [key, value] of Object.entries(libraryData)) {
        if (value.isbn === isbnToRemove) {
          db.ref("titles").child(key).remove()
        } else {
          updatedBooks.push(libraryData[key])
        }
      }
      setBooks(updatedBooks)
    })
  }

  // Toggle favorite status of a book and update state
  const changeFavoriteStatus = (isbnOfBookToChange) => {
    const db = firebase.database();
    db.ref("titles").get().then((data) => {
      const libraryData = data.val()
      const updatedBooks = []

      for (const [key, values] of Object.entries(libraryData)) {
        const isbnOfBook = libraryData[key].isbn
        const favoriteStatus = libraryData[key].favorite

        if(isbnOfBook === isbnOfBookToChange && favoriteStatus === false) { 
          db.ref("titles").child(key).update({favorite : true})
          values.favorite = true
          updatedBooks.push(values)
        } else if (isbnOfBook === isbnOfBookToChange && favoriteStatus === true){
          db.ref("titles").child(key).update({favorite : false});
          values.favorite = false
          updatedBooks.push(values)
        } else {
          updatedBooks.push(values)
        }
      }
      setBooks(updatedBooks)
    })
  }

    return (
      <div className="App">
        <header>
          <h1>Welcome to Evie's Library!</h1>
          <p>Here you will find a list of all the books in Evie's current library. Be sure to check back often to see what she has been reading recently!</p>
          <p>You can add new books by entering the ISBN in the field below (no dashes or spaces)</p>
          <nav className="nav-bar">
            <ul className="nav-button"><Link to="/home">Home</Link></ul>
            <ul className="nav-button"><Link to="/favorites">Favorite Books</Link></ul>
          </nav>
        </header>
        <div id="input-fields">
          <input className="search-box" placeholder="Search for a Book" onChange={searchBooksInput}></input>
          <input className="isbn-field" placeholder="Input ISBN here"></input>
          <button className="button-style" onClick={AddBook}>Add A Book</button>
        </div>
          <section id="book-list">
            <Route path="/home" render={() => {
              return !searchInput ? books.map((book) => {
                return <BookList book={book} searchInput={searchInput} deleteBook={deleteBook} changeFavoriteStatus={changeFavoriteStatus} />
              }) : searchResults.map((book) => {
                return <BookList book={book} deleteBook={deleteBook} />
              })
            }} />
            <Route path="/favorites" render={() => {
                return books.map((book) => {
                  if(book.favorite) {
                    return <BookList book={book} searchInput={searchInput} deleteBook={deleteBook} changeFavoriteStatus={changeFavoriteStatus} />
                  }   
                })
              }}
            />
    
          </section>
      </div>
    );
}

export default App;
