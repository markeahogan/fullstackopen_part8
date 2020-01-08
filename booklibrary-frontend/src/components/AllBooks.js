import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import BooksList from './BooksList';
import { ALL_BOOKS } from '../GraphQLPosts';

const AllBooks = () =>
{
    const {loading, data} = useQuery(ALL_BOOKS);

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