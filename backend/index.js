import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers/index.js";
import typeDefs from "./typedefs/index.js";
import http from 'http';
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import { buildContext } from "graphql-passport";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { connectDB } from "./db/connectdb.js";
import { configurePassport } from "./passport/passport.config.js";

const app = express();
configurePassport();

const httpServer = http.createServer(app);

const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.2.4",
  collection: "sessions"
});

store.on("error", (err) => console.log(err));

app.use(
  session({
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly:true,
      sameSite: "None",
      secure: false // Set to true in production (requires HTTPS)
    },
    store: store
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use(
  "/graphql",
  cors({
    origin: "http://localhost:3000", // Ensure this matches your client URL
    credentials: true // This allows cookies to be sent
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({ req, res })
  })
);

await connectDB();
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`Server is running on http://localhost:4000/`);

// Ensure your client-side code also includes credentials in the request
