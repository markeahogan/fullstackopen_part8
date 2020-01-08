import React, { useState, useEffect }from 'react';
import { useSubscription, useApolloClient } from '@apollo/react-hooks';
import './App.css';
import Authors from './components/Authors';
import AllBooks from './components/AllBooks';
import AddBookForm from './components/AddBookForm';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recomendations';
import { BOOK_ADDED, ALL_BOOKS } from './GraphQLPosts';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);

  const client = useApolloClient();

  const updateCache = (book) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, book)) {
      dataInStore.allBooks.push(book)
      client.writeQuery({
        query: ALL_BOOKS,
        data: dataInStore
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      //window.alert(`book added:${subscriptionData.data.bookAdded.title}`);
      updateCache(subscriptionData.data.bookAdded);
    }
  })

  useEffect(()=>{
    const localToken = localStorage.getItem('books-user-token');
    if (localToken){
      setToken(localToken);
    }
  },[]);

  const login = x => {
    setToken(x);
    localStorage.setItem('books-user-token', x);    
    setPage(x ? 'recommendations' : 'books');
  }

  const logout = () => {
    login(null);
  }

  const pages = {
    authors: <Authors />,
    books: <AllBooks />,
    addbook: <AddBookForm />,
    login: <LoginForm setToken={login}/>,
    recommendations : <Recommendations />
  }
  
  return (
    <>
    <div>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      {!token && <button onClick={() => setPage('login')}>login</button> }
      {token && <button onClick={() => setPage('recommendations')}>recommendations</button> }
      {token && <button onClick={() => setPage('addbook')}>add book</button> }
      {token && <button onClick={() => logout()}>logout</button> }
    </div>
    {pages[page]}
    </>
  );
}

export default App;
