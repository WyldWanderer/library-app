import React from 'react';

function BookList(props) {
    if(props) {
        return(
            <section className="book-container">
                <img className="img-style" src={props["book"][props.isbnKey[0]]["cover"]["medium"]} alt="Book Cover"/>
                <h3>{props["book"][props.isbnKey[0]]["title"]}</h3>
                <h1>{props["book"][props.isbnKey[0]]["authors"]["name"]}</h1>
            </section>
        )
    } else {
        return(
            <p>No Books Loaded Yet!</p>
            
        )
    }
}
export default BookList