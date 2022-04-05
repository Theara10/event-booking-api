const Event = require("../../models/event");
const { dateToString } = require("../../helpers/date");
const { user } = require("./merge");
console.log(user);

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

module.exports = {
  // get all events
  events: () => {
    return (
      Event.find()
        // .populate("creator")
        .then((events) => {
          return events.map((event) => {
            return transformEvent(event);
          });
        })
        .catch((err) => {
          throw err;
        })
    );
  },

  //create event function
  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date().toISOString(),
      creator: "621edd8447b4bc9610004060",
    });

    let createdEvent;
    const result = await event.save();

    createdEvent = transformEvent(result);
    const userExist = await User.findById("621edd8447b4bc9610004060");

    if (!userExist) {
      throw new Error("User not found");
    }
    userExist.createdEvents.push(event);
    await userExist.save();

    return createdEvent;
  },
};
