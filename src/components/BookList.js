import React from 'react';

function BookList(props) {
    if(props) {
        return(
            <section className="book-container">
                <img className="img-style" src={props.book.cover} alt="Book Cover"/>
                <h3>{props.book.title}<br></br>
                    Author: {props.book.author}</h3>
            </section>
        )
    } else {
        return(
            <p>No Books Loaded Yet!</p>
            
        )
    }
}
export default BookList