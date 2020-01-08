import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import BooksList from './BooksList';

const ALL_BOOKS = gql`
{
    allBooks 
    {
        title
        author{
            name
        }
        published
    }
}`

const AllBooks = () =>
{
    const {loading, data} = useQuery(ALL_BOOKS, { pollInterval: 500 });

    if (loading || !data){ 
        return <div>loading...</div> 
    }else{
        return (
        <>        
            <h1>books</h1>
            <BooksList books={data.allBooks} />
        </>
        )
    }
}

export default AllBooks;