import React, { useState, useEffect } from 'react';
import './App.css';
import { ReactDOM } from 'react-dom';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import BookList from './components/BookList.js'
import firebase from 'firebase'
import Database from './components/Database.js'
import { isValidISBN } from './helpers/validators';

const App = () => {
  const[books, setBooks] = useState([])
  const [newBookAdded, addBook] = useState(false)
  const [searchInput, updateSearch] = useState("")
  const [searchResults, searchedBookList] = useState([])

  library.add(fab, faHeart)

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
  
  // Function to check DB to see if the ISBN being added already exists in the DB (prevents duplicate books)
  const checkDBForISBN = (isbnToCheck) => {
    const currentISBN = books.map((book) => {
      return book.isbn === isbnToCheck ?  true : false; 
      })
    return currentISBN.includes(true) ? true : false; 
  }

  const AddBook= () => {
    const db = firebase.database();
    const isbnToAdd = document.querySelector(".isbn-field")
    const fullBookList = document.querySelector("#book-list")

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
          if(data[`ISBN:${isbnToAdd.value}`]["title"] && isbnToAdd.value) {
            db.ref("titles").push({
              title: data[`ISBN:${isbnToAdd.value}`]["title"],
              isbn: isbnToAdd.value,
              author: data[`ISBN:${isbnToAdd.value}`]["authors"]["0"]["name"],
              cover: data[`ISBN:${isbnToAdd.value}`]["cover"]["medium"],
              favorite: false  
            }) 
          } else {
            console.log("There was a problem with the ISBN entered")
          }
        })
        .then(() => {while(fullBookList.firstChild) {
            fullBookList.removeChild(fullBookList.firstChild)
          }
        })
        .then(() => {addBook(true)})

    } else {
      console.log("Is not a valid ISBN")
    }    
  }

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

  const deleteBook = (isbnToRemove) => {
    const db = firebase.database();
    db.ref("titles").on("value", (data) => {
      const libraryData = data.val()
      for (const [key, value] of Object.entries(libraryData)) {
        if (value.isbn === isbnToRemove) {
          db.ref("titles").child(key).remove()
        }
      }
    })
    window.location.reload(false)
  }

    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Evie's Library!</h1>
          <p>Here you will find a list of all the books in Evie's current library. Be sure to check back often to see what she has been reading recently!</p>
          <p>You can add new books by entering the ISBN in the field below (no dashes or spaces)</p>
          <div id="input-fields">
          <input className="search-box" placeholder="Search for a Book" onChange={searchBooksInput}></input>
          <input className="isbn-field" placeholder="Input ISBN here"></input>
          <button className="button-style" onClick={AddBook}>Add A Book</button>
          </div>
          <section id="book-list">
            {!searchInput ? books.map((book) => {
             return <BookList book={book} deleteBook={deleteBook}/>
            }) : searchResults.map((book) => {
              return <BookList book={book} deleteBook={deleteBook} />
            })} 
          </section>
        </header>
      </div>
    );
}

export default App;
