const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolvers = require("./graphql/resolvers/index");
// console.log("hi", graphqlResolvers);
const Event = require("./models/event");

const app = express();

app.use(bodyParser.json());

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: new Date(event._doc.date).toISOString(),
    // creator: user.bind(this, event.creator),
  };
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    // rootValue: {
    //   events: () => {
    //     return (
    //       Event.find()
    //         .then((events) => {
    //           return events.map((event) => {
    //             return transformEvent(event);
    //           });
    //         })
    //         .catch((err) => {
    //           throw err;
    //         })
    //     );
    //   },
    // },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster1.elaod.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.log(err);
  });
