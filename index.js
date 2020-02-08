const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();

new ApolloServer({
  typeDefs: gql`
    type Query {
      hello(name: String! = "world"): String!
    }
  `,
  resolvers: {
    Query: {
      hello: (_, args) => `Hello, ${args.name}!`
    }
  },
  plugins: [
    {
      requestDidStart: () => {
        const started = new Date();
        return {
          willSendResponse: ctx => {
            const ended = new Date();
            console.log(
              JSON.stringify({
                started,
                ended,
                method: ctx.request.http.method,
                url: ctx.request.http.url,
                queryDoc: ctx.request.query,
                reqHeaders: [...ctx.request.http.headers.entries()],
                respHeaders: [...ctx.response.http.headers.entries()],
                operationName: ctx.operationName,
                variables: ctx.request.variables,
                data: !!ctx.response.data,
                errors: ctx.response.errors
              })
            );
          }
        };
      }
    }
  ]
}).applyMiddleware({
  app,
  path: "/"
});

const port = process.env.HTTP_PORT || 4000;
app.listen(
  {
    port
  },
  () => console.log(`Server ready at localhost:${port}`)
);
