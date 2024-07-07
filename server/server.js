const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Book = require('./models/Book');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    token: String
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String
    image: String
    link: String!
  }

  type Query {
    searchBooks(query: String!): [Book]
    savedBooks: [Book]
  }

  type Mutation {
    signup(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    saveBook(title: String!, author: String!, description: String, image: String, link: String!): Book
    removeBook(id: ID!): Book
  }
`;

const resolvers = {
  Query: {
    searchBooks: async (_, { query }) => {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
      const data = await response.json();
      return data.items.map(item => ({
        title: item.volumeInfo.title,
        author: item.volumeInfo.authors[0],
        description: item.volumeInfo.description,
        image: item.volumeInfo.imageLinks.thumbnail,
        link: item.volumeInfo.infoLink,
      }));
    },
    savedBooks: async (_, __, context) => {
      if (!context.user) throw new Error('Not authenticated');
      return await Book.find({ userId: context.user.id });
    }
  },
  Mutation: {
    signup: async (_, { username, email, password }) => {
      const user = new User({ username, email, password: bcrypt.hashSync(password, 10) });
      await user.save();
      const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
      return { id: user.id, username: user.username, email: user.email, token };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !bcrypt.compareSync(password, user.password)) throw new Error('Invalid credentials');
      const token = jwt.sign({ id: user.id }, 'SECRET_KEY');
      return { id: user.id, username: user.username, email: user.email, token };
    },
    saveBook: async (_, { title, author, description, image, link }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const book = new Book({ userId: context.user.id, title, author, description, image, link });
      await book.save();
      return book;
    },
    removeBook: async (_, { id }, context) => {
      if (!context.user) throw new Error('Not authenticated');
      const book = await Book.findByIdAndDelete(id);
      return book;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const user = jwt.verify(token, 'SECRET_KEY');
      return { user };
    } catch {
      return {};
    }
  }
});

mongoose.connect('mongodb://localhost:27017/booksearch', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
