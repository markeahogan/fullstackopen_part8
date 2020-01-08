import React, {useState}from 'react';
import './App.css';
import Authors from './components/Authors';
import AllBooks from './components/AllBooks';
import AddBookForm from './components/AddBookForm';
import LoginForm from './components/LoginForm';
import Recommendations from './components/Recomendations';

const App = () => {
  const [page, setPage] = useState('authors');
  const [token, setToken] = useState(null);

  useEffect(()=>{
    const localToken = localStorage.getItem('books-user-token');
    if (localToken){
      setToken(localToken);
    }
  },[]);

  const login = x => {
    setToken(x);
    localStorage.setItem('books-user-token', x);
    setPage('recommendations');
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
