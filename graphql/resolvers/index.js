const authResolver = require("./auth");
const eventsResolver = require("./events");
const bookingResolver = require("./booking");
const Event = require("../../models/event");

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    // date: dateToString(event._doc.date),
    // creator: user.bind(this, event.creator),
  };
};
console.log("booking", bookingResolver);
const rootResolver = { ...authResolver, ...eventsResolver, ...bookingResolver };

module.exports = rootResolver;
