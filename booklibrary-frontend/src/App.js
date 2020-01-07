import React, {useState}from 'react';
import './App.css';
import Authors from './components/Authors';
import Books from './components/Books';
import AddBookForm from './components/AddBookForm';

const App = () => {
  const [page, setPage] = useState('authors');
  const [user, setUser] = useState(null);
  
  let content = null;
  if (page === 'authors'){
    content = <Authors />
  }else if (page === 'addbook'){
    content = <AddBookForm />
  }else{
    content = <Books />
  }

  return (
    <>
    <div>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      <button onClick={() => setPage('addbook')}>add book</button>
      <button onClick={() => setPage('login')}>login</button>
    </div>
    {content}
    </>
  );
}

export default App;
