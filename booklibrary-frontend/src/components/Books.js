import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const ALL_BOOKS = gql`
{
    allBooks 
    {
        title
        author
        published
    }
}`

const Books = () => {

    const {loading, data} = useQuery(ALL_BOOKS, {pollInterval: 500});
    if (loading){ return <div>loading...</div> }

    return (
        <>
        <h1>books</h1>
        <table>
            <tbody>
            <tr><th></th><th>author</th><th>published</th></tr>
            {data.allBooks.map((x,i) => <tr key={i}><td>{x.title}</td><td>{x.author}</td><td>{x.published}</td></tr>)}
            </tbody>
        </table>
        </>
    );
}

export default Books;