import React, { Component } from 'react';
import './App.css';
import BookList from './components/BookList.js'

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      books : [], 
      isbnList : ["9781785041853", "1594200092", "9781423607120", "9780525954187"],
      areBooksLoaded : false
    }
  }

  componentDidMount() {
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
  

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Welcome to Evie's Library!</h1>
          <p>Here you will find a list of all the books in Evie's current library. Be sure to check back often to see what she has been reading recently!</p>
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
