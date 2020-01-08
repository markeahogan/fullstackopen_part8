import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import BooksList from './BooksList';
import { RECOMMENDED_BOOKS, ME } from '../GraphQLPosts';

const Recommendations = () =>
{    
    const {loading, data} = useQuery(RECOMMENDED_BOOKS, {
        variables:{ genre:"comedy" },
        pollInterval: 500
    });

    const meQuery = useQuery(ME);
    console.log("me", meQuery.data);

    if (loading || !data){
        return <div>loading...</div>
    }else{
        return (
        <>        
            <h1>Recommendations</h1>
            <h3>Books in your favorite genre</h3>
            <BooksList books={data.allBooks} />
        </>
        )
    }
};

export default Recommendations;