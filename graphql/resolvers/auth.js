const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const { events } = require("./merge");

module.exports = {
  // Get all users
  users: async () => {
    try {
      const users = await User.find();
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  //create user function
  createUser: (args) => {
    return User.find({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists already");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        return { ...result._doc, password: null, _id: result.id };
      })
      .catch((err) => {
        throw err;
      });
  },
};
