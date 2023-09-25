const Joi = require("joi");

const genRegex = /^[ATCG][ATCG]*$/;

/**
 * Schema that will validate an object with dna property as array.
 * This array must fulfill that gens must be a nitrogen base (C|A|T|G)
 */
const mutantBodySchema = Joi.object().keys({
  dna: Joi.array().items(Joi.string().regex(genRegex)).required(),
});

module.exports = {
  mutantBodySchema,
};
