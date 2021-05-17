import React from 'react';

function BookList(props) {
    if(props.books) {
        return(
            <section>
                <img src={props["book"][props.isbnKey[0]]["cover"]["medium"]} alt="Book Cover"/>
                <h3>{props["book"][props.isbnKey[0]]["title"]}</h3>
            </section>
        )
    } else {
        return(
            <p>No Books Loaded Yet!</p>
            
        )
    }
}
export default BookList