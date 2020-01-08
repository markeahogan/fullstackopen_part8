import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Form, FormTextField } from './FormTextField';
import useTextField from '../hooks/useTextField';
import { ALL_AUTHORS, EDIT_AUTHOR } from '../GraphQLPosts'

const Authors = () => {

    const {loading, data} = useQuery(ALL_AUTHORS);
    const [editAuthorMut] = useMutation(EDIT_AUTHOR);
    const nameField = useTextField('');
    const bornField = useTextField('');
    
    if (loading || !data || !data.allAuthors){ return <div>loading...</div> }

    const editAuthor = () => {
        editAuthorMut({
            variables:{
                name: nameField.value || authors[0].name,
                setBornTo: Number.parseInt(bornField.value)
            },
            refetchQueries: ["AllAuthors"]
        })
    }

    const authors = data.allAuthors;
    
    return (
        <>
        <h1>authors</h1>
        <table>
            <tbody>
            <tr><th></th><th>born</th><th>books</th></tr>
            {authors.map((x,i) => <tr key={i}><td>{x.name}</td><td>{x.born}</td><td>{x.bookCount}</td></tr>)}
            </tbody>
        </table>
        <h2>Edit author</h2>
        <select {...nameField}>
            {authors.map((x,i) => <option key={i}>{x.name}</option>)}
        </select>
        <Form onSubmit={() => editAuthor()}>
            <FormTextField label="born" {...bornField} />
        </Form>
        </>
    );
}

export default Authors;