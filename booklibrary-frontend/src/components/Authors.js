import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import FormTextField from './FormTextField';
import useTextField from '../hooks/useTextField';

const ALL_AUTHORS = gql`
{
    allAuthors 
    {
        name
        born
        bookCount
    }
}`

const EDIT_AUTHOR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!)
{
    editAuthor(name: $name, setBornTo: $setBornTo) 
    {
        name,
        born
    }
}`

const Authors = () => {

    const {loading, data} = useQuery(ALL_AUTHORS, {pollInterval: 500});
    const [editAuthorMut] = useMutation(EDIT_AUTHOR);
    const nameField = useTextField('');
    const bornField = useTextField('');
    
    if (loading){ return <div>loading...</div> }

    const editAuthor = () => {
        editAuthorMut({
            variables:{
                name: nameField.value || authors[0].name,
                setBornTo: Number.parseInt(bornField.value)
            }
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
        <form onSubmit={e => {e.preventDefault(); editAuthor();}}>
        <select {...nameField}>
            {authors.map((x,i) => <option key={i}>{x.name}</option>)}
        </select>
        <table><tbody>
        <FormTextField label="born" {...bornField} />
        </tbody></table>
        <button type='submit'>Submit</button>
        </form>
        </>
    );
}

export default Authors;