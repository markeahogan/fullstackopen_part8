const { ApolloServer, gql, AuthenticationError, UserInputError, PubSub } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const pubsub = new PubSub()

mongoose.set('useFindAndModify', false);

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0-s2ye6.mongodb.net/test?retryWrites=true&w=majority';
const JWT_SECRET = "BART_IS_EL_BARTO";

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
  .then(() => { console.log('connected to MongoDB')})
  .catch((error) => { console.log('error connection to MongoDB:', error.message) });

const typeDefs = gql`
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: String!
    genres: [String!]
  }

  type Author {
    name: String
    bookCount: Int
    born: Int
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {    
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]
    allAuthors: [Author!]
    me: User
  }

  type Subscription {
    bookAdded: Book!
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

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    clear(
      what: String
    ): Int
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, {author, genre}) => {
      let books = await Book.find({}).populate('author');      
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
    allAuthors: async () => {
      const authors = await Author.find({});
      const books = await Book.find({});
      authors.forEach(x => x.bookCount = books.filter(y => y.author === x.id).length);
      return authors;
    },
    me: (root, args, context) => {
      return context.currentUser;
    }
  },
  Author:{
    bookCount: async (root) => {
      const author = await Author.findOne({name:root.name});    
      if (!author){ return 0; }  
      const books = await Book.find({author:author.id});
      return books.length;
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated"); }

      if (!args.author){ throw new UserInputError("No Author"); }

      let author = await Author.findOne({name:args.author});
      if (!author){ author = await new Author({name:args.author}).save(); }

      let book = new Book({...args, author:author.id});
      book = await book.save();
      book = await book.populate('author');
      
      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book;
    },
    editAuthor: async (root, {name, setBornTo}, context) => {
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated"); }

      const author = await Author.findOne({name});
      if (!author){ throw new UserInputError(`No Author with name ${name}`); }
      
      author.born = setBornTo;
      await author.save();
      return author;
    },
    createUser: async (root, {username, favoriteGenre}) => {
      try {
        const user = await new User({username, favoriteGenre}).save();
        return user;
      }catch(e){
        throw new UserInputError(e); 
      }
    },
    login: async (root, {username, password}) => {      
      const user = await User.findOne({ username })
      
      if (!user) {
        throw new UserInputError("wrong credentials")
      }
      
      const userForToken = {
        username: username,
        id: user.id
      }
  
      const token = { value: jwt.sign(userForToken, JWT_SECRET) };
      return token;
    },
    clear: async () => {
      await Book.deleteMany({});
      await Author.deleteMany({});
      return 1;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,  
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ') && !auth.includes('null')) {
      const decodedToken = jwt.verify( auth.substring(7), JWT_SECRET );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
