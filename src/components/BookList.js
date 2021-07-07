import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function BookList(props) {
    if(props) {
        return(
            <section className="book-container">
                {props.book.cover !== false ? 
                    <img className="img-style" src={props.book.cover} alt="Book Cover"/>
                    :
                    <img className="img-style" height="200px" width="200px" src="https://maxcdn.icons8.com/Share/icon/nolan/science/open_book1600.png"/>}
                <div className="title-author">
                    <h2>{props.book.title}</h2>
                    <h3>Author: {props.book.author}</h3>
                    <div className="book-buttons">
                        {props.book.favorite ? 
                            <FontAwesomeIcon icon="heart" size="2x" color="#ff69b4" onClick={() => props.changeFavoriteStatus(props.book.isbn)}/> 
                        :
                            <FontAwesomeIcon icon="heart" size="2x" onClick={() => props.changeFavoriteStatus(props.book.isbn)} />}
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