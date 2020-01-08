import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import BooksList from './BooksList';

const RECOMMENDED_BOOKS = gql`
    query FindRecommendedBooks($genre: String!) {
        allBooks(genre: $genre) {
            title
            author
            published
        }
    }`

const Recommendations = () =>
{    
    const {loading, data} = useQuery(RECOMMENDED_BOOKS, {
        variables:{ genre:"comedy" },
        pollInterval: 500
    });

    if (loading){
        return <div>loading...</div>
    }else{
        return (
        <>        
            <h1>Recommendations</h1>
            <BooksList books={data.allBooks} />
        </>
        )
    }
};

export default Recommendations;