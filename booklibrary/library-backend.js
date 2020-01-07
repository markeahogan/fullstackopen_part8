const { ApolloServer, gql, AuthenticationError, UserInputError } = require('apollo-server');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

mongoose.set('useFindAndModify', false);

const MONGODB_URI = 'mongodb+srv://fullstack:fullstack@cluster0-s2ye6.mongodb.net/test?retryWrites=true&w=majority';
const JWT_SECRET = "BART_IS_EL_BARTO";

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
  }
`

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, {author, genre}) => {
      let books = await Book.find({});      
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
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Author:{
    bookCount: async (root) => {
      return 0;
      const books = await Book.find({author:root.name});
      return books.length;
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) { throw new AuthenticationError("not authenticated"); }

      if (!args.author){ throw new UserInputError("No Author"); }

      let author = await Author.findOne({name:args.author});
      if (!author){ author = await new Author({name:args.author}).save(); }

      const book = new Book({...args, author});
      await book.save();

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
        username: user.username,
        id: user._id
      }
  
      token = { value: jwt.sign(userForToken, JWT_SECRET) };

      return token;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,  
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify( auth.substring(7), JWT_SECRET );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
