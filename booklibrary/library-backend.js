const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');

mongoose.set('useFindAndModify', false);

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0-s2ye6.mongodb.net/test?retryWrites=true&w=majority';

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => { console.log('connected to MongoDB')})
  .catch((error) => { console.log('error connection to MongoDB:', error.message) });

const typeDefs = gql`
  type Book {
    title: String!,
    published: Int!,
    author: Author!
    id: String!,
    genres: [String!]
  }

  type Author {
    name: String!,
    bookCount: Int!
    born: Int
  }

  type Query {    
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, {author, genre}) => {
      let books = await books.find({});      
      const hasAuthor = !!author;
      if (hasAuthor){
        books = books.filter(x => x.author.name != author);
      }      
      const hasGenre = genre && genre.length > 0;
      if (hasGenre){
        books = books.filter(x => x.genres.includes(genre));
      }      
      return books;
    },
    allAuthors: () => Author.find({})
  },
  Author:{
    bookCount: async (root) => {
      const books = await Book.find({author:root.name});
      return books.length;
    }
  },
  Mutation: {
    addBook: async (root, args) => {

      let author = await Author.findOne({name:args.author});
      if (!author){
        author = await new Author({name:args.author}).save();
      }
      const book = new Book({...args, author});
      await book.save();

      //if (!authors.find(x => x.author === book.author)){
      //  authors = authors.concat({name:book.author});
      //}

      return book;
    },
    editAuthor: async (root, {name, setBornTo}) => {
      const author = Author.findOne({name});
      //todo error hadling
      author.born = setBornTo;
      await author.save();
      return author;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
