// Directions to check
const DIRECTIONS = {
  RIGHT: "right",
  BOTTOM: "bottom",
  RIGHT_UP: "right_up",
  RIGHT_BOTTOM: "right_bottom",
};
Object.freeze(DIRECTIONS);

// Number of repeats to be mutant
const NUMBER_OF_REPEATS = 4;

// Request properties
const REQUEST = {
  BODY: "body",
  PARAMS: "params",
  QUERY: "query",
};
Object.freeze(REQUEST);

module.exports = { DIRECTIONS, NUMBER_OF_REPEATS, REQUEST };
