import React from 'react'

const FavoritesList = (props) => {
    return(
        // if(props.book.favorite) {
        //     <section className="book-container">
        //         {props.book.cover !== false ? 
        //             <img className="img-style" src={props.book.cover} alt="Book Cover"/>
        //             :
        //             <img className="img-style" height="200px" width="200px" src="https://maxcdn.icons8.com/Share/icon/nolan/science/open_book1600.png"/>}
        //         <div>
        //             <h2>{props.book.title}</h2>
        //             <h5>Author: {props.book.author}</h5>
        //             <div className="book-buttons">
        //                 {props.book.favorite ? 
        //                     <FontAwesomeIcon icon="heart" color="#ff69b4" onClick={() => props.changeFavoriteStatus(props.book.isbn)}/> 
        //                 :
        //                     <FontAwesomeIcon icon="heart" onClick={() => props.changeFavoriteStatus(props.book.isbn)} />}
        //                 <button className="delete" onClick={() => props.deleteBook(props.book.isbn)}>Remove Book</button>
        //             </div>
        //         </div>
        //     </section>
        // }
    )
}

export default FavoritesList