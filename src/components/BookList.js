import React from 'react';
import reactDom from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function BookList(props) {
    if(props) {
        return(
            <section className="book-container">
                <img className="img-style" src={props.book.cover} alt="Book Cover"/>
                <div>
                    <h2>{props.book.title}</h2>
                    <h5>Author: {props.book.author}</h5>
                    <div className="book-buttons">
                        <FontAwesomeIcon icon="heart" color="red"/>
                        <button className="delete" onClick={() => props.deleteBook(props.book.isbn)}>Remove Book</button>
                    </div>
                </div>
            </section>
        )
    } else {
        return(
            <p>No Books Loaded Yet!</p>
            
        )
    }
}
export default BookList