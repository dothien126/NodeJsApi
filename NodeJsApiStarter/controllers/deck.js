/**

 */

const Deck = require("../models/Deck");
const User = require("../models/User");

const Joi = require("@hapi/joi");
const idSchema = Joi.object().keys({
  userID: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

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

const getDeck = async (req, res, next) => {
    const deck = await Deck.findById(req.value.params.deckID)

    return res.status(200).json({deck})
};

const index = async (req, res, next) => {
  const decks = await Deck.find({});
  return res.status(200).json({ decks });
};

const newDeck = async (req, res, next) => {
  // find owner
  const owner = await User.findById(req.value.body.owner);

  const deck = req.value.body;
  delete deck.owner;

  deck.owner = owner._id;
  const newDeck = new Deck(deck);
  await newDeck.save();

  // add new created deck to the actual decks
  owner.decks.push(newDeck._id);
  await owner.save();

  return res.status(201).json({ deck: newDeck });
}; 

const replaceDeck = async(req, res, next) => {
      // khi sửa đổi thông tin sẽ thay đổi hết các thông tin
  const { deckID } = req.value.params;

  const newDeck = req.value.body;

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);

  return res.status(200).json({ success: true });
}

const updateDeck = async(req, res, next) => {
    // chỉ thay đổi 1 thông tin

  const { deckID } = req.value.params;

  const newDeck = req.value.body;

  const result = await Deck.findByIdAndUpdate(deckID, newDeck);
  // check if put user, remove deck in user's model

  return res.status(200).json({ success: result });
}

const deleteDeck = async(req, res, next) => {
    const {deckID} = req.value.params
    
    const deck = await Deck.findById(deckID)
    const ownerID = deck.owner

    const owner = await User.findById(ownerID)

    await deck.remove()

    owner.decks.pull(deck)
    await owner.save()
    return res.status(200).json({success: true})

}

module.exports = {
  getDeck,
  index,
  newDeck,
  replaceDeck,
  updateDeck,
  deleteDeck
};
