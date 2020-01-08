import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import useTextField from '../hooks/useTextField';
import {Form, FormTextField } from './FormTextField';
import {ADD_BOOK } from '../GraphQLPosts';

const AddBookForm = () => {
    const [addBookMut] = useMutation(ADD_BOOK);
    const titleField = useTextField();
    const authorField = useTextField();
    const publishedField = useTextField();
    const genreField = useTextField();

    const addBook = () => {
        addBookMut({ 
            variables: {
                title: titleField.value,
                author: authorField.value,
                published: Number.parseInt(publishedField.value),
                genres: genreField.value.split(',')
            },            
            refetchQueries: ["AllBooks", "AllAuthors"]
        });
        titleField.clear();
        authorField.clear();
        publishedField.clear();
        genreField.clear();
    };
    
    return (
        <>
        <h1>Add Book</h1>
        <Form onSubmit={() => addBook()} >
            <FormTextField label="title" {...titleField} />
            <FormTextField label="author" {...authorField} />
            <FormTextField label="published" {...publishedField} />
            <FormTextField label="genres" {...genreField} />
        </Form>
        </>
    );
}

export default AddBookForm;