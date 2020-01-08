import { gql } from 'apollo-boost';

const BOOK_DETAILS = gql`
fragment BookDetails on Book
{
    title
    author { name }
    published
    id
}`

export const BOOK_ADDED = gql`
subscription
{
    bookAdded
    {
        ...BookDetails
    }
}
${BOOK_DETAILS}`

export const ADD_BOOK = gql`
mutation AddBook($title: String!, $author: String!, $published: Int!, $genres: [String!])
{
    addBook(title: $title, author: $author, published: $published, genres: $genres) 
    {
        ...BookDetails
    }
}
${BOOK_DETAILS}`

export const ALL_BOOKS = gql`
query AllBooks {
    allBooks 
    {
        ...BookDetails
    }
}
${BOOK_DETAILS}`

export const RECOMMENDED_BOOKS = gql`
query RecommendedBooks($genre: String!) {
    allBooks(genre: $genre) {
        ...BookDetails
    }
}
${BOOK_DETAILS}`

export const ME = gql`
query Me {
    me {
        username,
        favoriteGenre
    }
}`

export const LOGIN = gql`
mutation Login($username: String! $password: String!)
{
    login(username:$username password:$password) 
    {
        value
    }
}`

export const ALL_AUTHORS = gql`
query AllAuthors{
    allAuthors 
    {
        name
        born
        bookCount
    }
}`

export const EDIT_AUTHOR = gql`
mutation EditAuthor($name: String!, $setBornTo: Int!)
{
    editAuthor(name: $name, setBornTo: $setBornTo) 
    {
        name,
        born
    }
}`