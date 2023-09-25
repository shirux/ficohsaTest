const express = require("express");
const router = express.Router();
const { postCheckMutation } = require("../controllers/mutant.controller");
const { validate } = require("../middleware/validation.middleware");
const { mutantBodySchema } = require("../dto/mutant.dto");
const { REQUEST } = require("../constants");

router.post("/", validate(mutantBodySchema, REQUEST.BODY), postCheckMutation);

module.exports = router;
