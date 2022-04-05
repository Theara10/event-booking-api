const Event = require("../../models/event");
const Booking = require("../../models/booking");

const { singleEvent, user } = require("./merge");

const { dateToString } = require("../../helpers/date");

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event.creator),
  };
};

const events = async (eventsId) => {
  try {
    const events = await Event.find({ _id: { $in: eventsId } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        // console.log(booking._doc);
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args) => {
    const event = await Event.findById({ _id: args.eventId });
    const booking = new Booking({
      event: event,
      user: "621edd8447b4bc9610004060",
    });
    const result = await booking.save();
    return transformBooking(result);
  },

  cancelBooking: async (args) => {
    console.log(args);
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");
      console.log(booking);
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
