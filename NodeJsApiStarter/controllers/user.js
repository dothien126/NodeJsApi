/**

 */

const Deck = require("../models/Deck");
const User = require("../models/User");

const Joi = require("@hapi/joi")
const idSchema = Joi.object().keys({
  userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

// const index = (req, res, next) => {
//   // callback
//   User.find({}, (err, users) => {
//     if (err) next(err);

//     return res.status(200).json({ users });
//   });

//   //   return res.status(200).json( {
//   //       message: "You requested to user handle."
//   //   })
// };

// const newUser = (req, res, next) => {
//   console.log("req.body content ", req.body);

//   //create object model
//   const newUser = new User(req.body);
//   console.log("newUser", newUser);

//   //
//   newUser.save((err, user) => {
//     console.error("Error", err);
//     console.log("User saved ", user);
//     return res.status(201).json({ users });
//   });
// };

// const index = (req, res, next) => {
//   // Promises
//   User.find({})
//     .then((users) => {
//       return res.status(200).json({ users });
//     })
//     .catch((err) => next(err));
// };

const index = async (req, res, next) => {
  try {
    const users = await User.find({});
    // throw new Error("Random error!");
    return res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
};

// const newUser = (req, res, next) => {
//   console.log("req.body content ", req.body);

//   //create object model
//   const newUser = new User(req.body);
//   console.log("newUser", newUser);
//   newUser
//     .save()
//     .then((user) => {
//       return res.status(201).json({ user });
//     })
//     .catch((err) => next(err));
// };

const newUser = async (req, res, next) => {
  const newUser = new User(req.value.body);

  await newUser.save();

  return res.status(201).json({ user: newUser });
};

const getUser = async (req, res, next) => {
  const validatorResult = idSchema.validate(req.params);
  console.log("validateResult", validatorResult)

  const { userID } = req.value.params;

  const user = await User.findById(userID);

  return res.status(200).json({ users });
};

const getUserDecks = async (req, res, next) => {
  const { userID } = req.value.params;

  const user = await User.findById(userID).populate("decks");

  return res.status(200).json({ deck: user.decks });
};

const newUserDeck = async (req, res, next) => {
  const { userID } = req.value.params;

  // create a new deck
  const newDeck = new Deck(req.value.body);
  // get user
  const user = await User.findById(userID);
  // assign use as deck's owner
  newDeck.owner = user;
  // save the deck
  await newDeck.save();
  // add deck to user's decks array
  user.decks.push(newDeck.__id);
  // save the user
  await user.save();

  res.status(200).json({ deck: newDeck });
};

const replaceUser = async (req, res, next) => {
  // khi sửa đổi thông tin sẽ thay đổi hết các thông tin
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userId, newUser);

  return res.status(200).json({ success: true });
};

const updateUser = async (req, res, next) => {
  // chỉ thay đổi 1 thông tin

  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userId, newUser);

  return res.status(200).json({ success: result });
};

module.exports = {
  index,
  newUser,
  getUser,
  replaceUser,
  updateUser,
  getUserDecks,
  newUserDeck,
};
