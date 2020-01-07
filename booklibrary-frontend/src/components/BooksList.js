import React from 'react';

const BooksList = ({books}) => {
    return (
        <table>
            <tbody>
            <tr><th></th><th>author</th><th>published</th></tr>
            {books.map((x,i) => <tr key={i}><td>{x.title}</td><td>{x.author.name}</td><td>{x.published}</td></tr>)}
            </tbody>
        </table>
    );
}

export default BooksList;