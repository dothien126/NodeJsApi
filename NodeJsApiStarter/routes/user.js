const express = require("express");
const res = require("express/lib/response");
// const router = express.Router();
const router = require("express-promise-router")();

const userController = require("../controllers/user");

const { validateBody, validateParam, schemas } = require("../helpers/routerHelpers")

router.route("/")
    .get(userController.index)
    .post(validateBody(schemas.userSchema), userController.newUser);

router.route("/:userID")
    .get(validateParam(schemas.idSchema, "userID"), userController.getUser)
    .put(validateParam(schemas.idSchema, "userID"), validateBody(schemas.userSchema), userController.replaceUser)
    .patch(validateParam(schemas.idSchema, "userID"), validateBody(schemas.userOptionalSchema), userController.updateUser)

router.route("/:userID/decks")
    .get(validateParam(schemas.idSchema, "userID"), userController.getUserDecks)
    .post(validateParam(schemas.idSchema, "userID"), validateBody(schemas.deckSchema), userController.newUserDeck)

module.exports = router;
