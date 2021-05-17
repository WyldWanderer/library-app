import React, { Component } from 'react';
import './App.css';
import BookList from './components/BookList.js'
import firebase from 'firebase'
import Database from './components/Database.js'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      books : [], 
      isbnList : [],
      areBooksLoaded : false,
      newBookAdded: false
    }   
  }

  componentDidMount() {
    this.GetBooksFromDB()

    this.state.isbnList.forEach((isbnNumber) => {
      fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnNumber}&jscmd=data&format=json`) 
        .then((response) => {
          if(response.ok) {
            return response.json();  
          } else {
            throw response.status;
          }
        })
        .then((data) => {
          if(data) {
            this.state.books.push(data)
          }  
        })
        .then(() => {
          this.setState({areBooksLoaded:true})
        })
        .catch(() => {
          console.log("Data failed to load")
        }) 
      })
    }

  GetBooksFromDB = () => {
    const db = firebase.database();

    db.ref("titles").on("value", (data) => {
      const bookISBN = data.val();
      console.log(bookISBN[`-M_wId2vQ8HsuAOzOB9R`].isbn)
      
      // Need to create another loop to access ISBN values from object seen in console.log above
    })
  }
  
  AddBook= () => {
    const db = firebase.database();
    const isbnToAdd = document.querySelector(".isbn-field").value
    console.log(isbnToAdd)
  
    fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbnToAdd}&jscmd=data&format=json`) 
      .then((response) => {
        if(response.ok) {
          return response.json();  
        } else {
          throw response.status;
        }
      })
      .then((data) => {
        console.log(data)
        db.ref("titles").push({
          title: data[`ISBN:${isbnToAdd}`]["title"],
          isbn: isbnToAdd 
        })
        console.log("sent to DB") 
      })
    
  // Need help here, getting "Cannot read property 'state' of undefined"    
    this.state.isbnList = [...this.state.isbnList, isbnToAdd]
    this.setState({newBookAdded: true})
        
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Evie's Library!</h1>
          <p>Here you will find a list of all the books in Evie's current library. Be sure to check back often to see what she has been reading recently!</p>
          <input className="isbn-field" placeholder="Use ISBN to add a book"></input>
          <button className="button-style" onClick={this.AddBook}>Add A Book</button>
          <section>
            {this.state.books.map((book) => {
             const key = Object.keys(book)
             return <BookList book={book} isbnKey={key}/>
            })} 
          </section>
        </header>
      </div>
    );
  }
}

export default App;
