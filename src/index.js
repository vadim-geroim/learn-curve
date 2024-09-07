const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./resolvers/resolvers");
const port = process.env.PORT || 3000;

//Apollo server instance

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    //handle later
  },
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
